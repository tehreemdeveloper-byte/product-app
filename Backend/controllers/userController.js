 import bcrypt from "bcryptjs";
 import fs from "fs/promises";
 import path from "path";
import { fileURLToPath } from "url";
import { mongoose } from "mongoose";
import asyncHandler from "express-async-handler";

import fcmController from "./fcmTokenController.js";
import AuthController from "./authController.js";
import sendEmail from "./emailController.js";

import rolesModel from "../models/roleModel.js";
import userModel from "../models/userModel.js";
import companyModel from "../models/companyModel.js";
import pilotProfileModel from "../models/pilotProfileModel.js";
import mediaModel from "../models/mediaModel.js";
import Subscription from "../models/subscriptionModel.js";
import flightLogBook from "../models/flightlogBookModel.js";
import creatorModel from "../models/creatorModel.js";
import consultantModel from "../models/consultantModel.js";
import PilotProfileModel from "../models/pilotProfileModel.js";
import jobModel from "../models/jobModel.js";
import fcmModel from "../models/fcmModel.js";

import notificationModel from "../models/notificationModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ObjectId = mongoose.Types.ObjectId;

export default class userController extends AuthController {

    static getUser = asyncHandler(async (req, res) => {
        try {
            const userId = req.user;
            if (!userId) {
                res.status(404);
                throw new Error("User not found");
            }


            const user = await userModel
                .findById(userId)
                .select("-password")
                .populate("picture"); // Password ko exclude karna

            const role = await rolesModel.findById(user.role_id);

            const userData = {
                ...user.toObject(),
                role_name: role.name,
                role_id: user.role_id,
            };
            return res
                .status(200)
                .json(this.responseGenerator(userData, 200, "User information"));
        } catch (error) {
            throw new Error(error);
        }
    });

    // admin getting percentage 
    static getAdminDetails = asyncHandler(async (req, res) => {
        try {

            const userId = req.user;
            if (!userId) {
                res.status(404);
                throw new Error("User not found");
            }

            const roleDetails = await rolesModel.findOne({ _id: userId.role_id });
            if (!roleDetails) {
                res.status(400);
                throw new Error("Role details not found");
            }

            if (roleDetails.key != "admin") {
                res.status(403);
                throw new Error("You are not allowed for this method");
            }

            const user = await userModel
                .findById(userId)
                .select("-password")
                .populate("picture"); // Password ko exclude karna

            const companyDetails = await companyModel.findOne({ _id: userId.company_id });
            if (!companyDetails) {
                res.status(404);
                throw new Error("Company details not found");
            }

            let profileProgress = 0;

            if (companyDetails.name?.trim()) profileProgress += 12.5;
            if (companyDetails.website?.trim()) profileProgress += 12.5;
            if (companyDetails.companyInterest && companyDetails.companyInterest.length > 0) profileProgress += 12.5;
            if (companyDetails.experience?.typeRating && companyDetails.experience.typeRating.length > 0) profileProgress += 12.5;
            if (companyDetails.email?.trim()) profileProgress += 12.5;
            if (companyDetails.phone?.trim()) profileProgress += 12.5;
            if (companyDetails.description?.trim()) profileProgress += 12.5;
            if (companyDetails.industry) profileProgress += 12.5;


            const data = {
                role_name: roleDetails.name,
                role_id: user.role_id,
                profileProgress,
                ...user.toObject(),
            }

            return res.status(200).json(this.responseGenerator(data, 200, "Admin details found."));


        } catch (err) {
            res.status(400);
            throw new Error(err);
        }
    });

    static getAlluserList = asyncHandler(async (req, res) => {
        try {

            const user = req.user
            const isRoleExist = await rolesModel.findById(user.role_id);

            if (!isRoleExist) {
                res.status(404);
                throw new Error("User role does not exist");
            }
            if (isRoleExist.key !== "superadmin") {
                res.status(403);
                throw new Error("You are not allowed for this method");
            }

            let { role } = req.query;

            let limit = req.query.limit && Number(req.query.limit) <= 50 ? Number(req.query.limit) : 9;
            let page = req.query.page ? Number(req.query.page) : 1;
            const sort = req.query.sort ? Number(req.query.sort) : -1;
            const search = req.query.search ? req.query.search : "";



            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * limit;
            }

            let matchQuery = { is_deleted: false };

            if (role) {
                const roleData = await rolesModel.findOne({ key: role });
                if (roleData) {
                    matchQuery.role_id = roleData._id;
                }
            }

            if (search) {
                matchQuery.$or = [
                    { first_name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ];
            }

            const userList = await userModel.aggregate([
                { $match: matchQuery },
                {
                    $lookup: {
                        from: "tbl_companies",
                        localField: "company_id",
                        foreignField: "_id",
                        as: "companyInfo"
                    }
                },
                {
                    $lookup: {
                        from: "tbl_roles",
                        localField: "role_id",
                        foreignField: "_id",
                        as: "roleDetails"
                    }
                },

                {
                    $project: {
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        role_id: 1,
                        status: 1,
                        companyInfo: 1,
                        company_name: { $arrayElemAt: ["$companyInfo.name", 0] },
                        role: { $arrayElemAt: ["$roleDetails.key", 0] },
                        createdAt: 1

                    }
                },
                { $sort: { createdAt: sort } },

                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]);
            if (userList && userList.length > 0) {
                const userListcount = await userModel.aggregate([

                    { $match: matchQuery },
                    { $count: "total_count" },
                ]);
                let a = 0;
                if (userListcount.length > 0) {
                    a = userListcount[0].total_count;
                }
                return res.status(200).json(this.responseGenerator({
                    list: userList,
                    page: page,
                    limit: limit,
                    total: a,
                }, 200));
            } else {
                res.status(404);
                throw new Error("userList not found");
            }

        } catch (error) {
            throw new Error(error);
        }
    });

    static postAdmin = asyncHandler(async (req, res) => {
        try {
            const loggedInUser = req.user;

            const loggedInUserRole = await rolesModel.findById(loggedInUser.role_id);
            if (!loggedInUserRole) {
                res.status(404);
                throw new Error("User role not found");
            }

            if (
                loggedInUserRole.key !== "superadmin" &&
                loggedInUserRole.key !== "admin"
            ) {
                res.status(403);
                throw new Error("You are not allowed for this method");
            }

            const { first_name, last_name, company_id, email, password, role_key } = req.body;

            if (!first_name || !last_name || !email || !password) {
                res.status(400);
                throw new Error("Please fill all the fields");
            }

            let assignedCompanyId;

            if (loggedInUserRole.key === "superadmin") {
                if (!company_id) {
                    res.status(400);
                    throw new Error("Company ID is required for superadmin");
                }
                assignedCompanyId = company_id;
            } else if (loggedInUserRole.key === "admin") {
                assignedCompanyId = loggedInUser.company_id;
            }

            const companyExists = await companyModel.findOne({
                _id: assignedCompanyId,
                is_deleted: false,
            });
            if (!companyExists) {
                res.status(404);
                throw new Error("Company not found");
            }

            const userExists = await userModel.findOne({
                email: email.toLowerCase(),
                is_deleted: false,
            });
            if (userExists) {
                res.status(409);
                throw new Error("User already exists");
            }

            const role = await rolesModel.findOne({
                key: role_key,
                is_deleted: false,
            });
            if (!role) {
                res.status(404);
                throw new Error("Role not found");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.create({
                company_id: assignedCompanyId,
                first_name: first_name,
                last_name: last_name,
                password: hashedPassword,
                email: email.toLowerCase(),
                status: true,
                role_id: role._id,
            });

            if (!newUser) {
                res.status(400);
                throw new Error("error while creating user");
            }

            // email code added here 

            let subject = `Welcome to FlyHire, ${first_name}! 🚀`;
            let message = `<p>Hi ${first_name},</p><br/>
                        <p>We’re excited to have you on board! With <strong>FlyHire</strong>, you can find top-tier pilots faster and easier than ever.</p>
                        <ul>
                            <li>✅ Post job listings in minutes</li>
                            <li>✅ Get AI-powered candidate matches</li>
                            <li>✅ Manage hiring seamlessly</li>
                        </ul><br/>
                        <p><a href="${process.env.SITE_DOMAIN}/admin/job-list">Post Your First Job</a></p><br/>

                         <p>
                <a href="${process.env.SITE_DOMAIN}" 
                style="display: inline-block; padding: 10px 20px; background-color: #0f5fb6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Explore the Site
                </a>

                 </p><br/>  
                        
                        <p>Fly Higher,</p>
                        <p><strong>- The FlyHire Crew ✈️</strong></p>
                       `;

            const emailSent = await sendEmail(email, subject, message);
            if (!emailSent) {
                res.status(400);
                throw new Error("Failed to send email. Please try again.");
            }

            return res
                .status(201)
                .json(
                    this.responseGenerator(newUser, 201, "The admin has been created successfully, and an email has been sent.")
                );


            // email code ended Here
        } catch (error) {
            throw new Error(error);
        }
    });

    static connectrequestuser = asyncHandler(async (req, res) => {
        try {

            // jis ko request bajni h uski id a rhi h mry pas...connectionRequests
            // ager ma hi usko dubra baju request jsi ki id peri hooi h is it possible for it 
            const targetUser = await userModel.findById(req.params.id);

            const isFriend = targetUser.connections.some(friend => friend.toString() === req.user.id.toString());
            if (isFriend) {
                res.status(409);
                throw new Error("You are already friends");
            }
            const loginUser = await userModel.findById(req.user.id);
            // const isResponseRequire = targetUser.connectionRequests.some(friend => friend.toString() === req.user.id.toString());
            // if (isResponseRequire) {
            //     res.status(400);
            //     throw new Error("Your response is pending for this user");
            // }

            let message = "";
            if (!targetUser.connectionRequests.includes(req.user.id)) {
                targetUser.connectionRequests.push(req.user.id);
                loginUser.sentRequest.push(req.params.id);
                message = "Connection request has been sent."

            } else {
                targetUser.connectionRequests.pull(req.user.id);
                loginUser.sentRequest.pull(req.params.id);
                message = "Connection request has been cancelled."
            }

            await loginUser.save();
            await targetUser.save();

            return res
                .status(200)
                .json(
                    this.responseGenerator(null, 200, message)
                );
        } catch (error) {
            throw new Error(error);
        }
    });

    static acceptuserrequest = asyncHandler(async (req, res) => {
        try {
            const currentUser = await userModel.findById(req.user.id);

            if (currentUser.connectionRequests.includes(req.params.id)) {
                currentUser.connections.push(req.params.id);
                currentUser.connectionRequests = currentUser.connectionRequests.filter(id => id != req.params.id);
                await currentUser.save();

                const requester = await userModel.findById(req.params.id);
                requester.connections.push(req.user.id);
                await requester.save();
                return res
                    .status(200)
                    .json(
                        this.responseGenerator(null, 200, "Connection request has been accepted.")
                    );
            } else {
                res.status(400);
                throw new Error('No connection request found.');
            }
        } catch (error) {
            throw new Error(error);
        }
    });

    // back logic
    static rejectUserRequest = asyncHandler(async (req, res) => {
        try {
            const currentUser = await userModel.findById(req.user.id);

            // Check if the request exists
            if (!currentUser.connectionRequests.includes(req.params.id)) {
                res.status(400);
                throw new Error("No connection request found.");
            }

            // Remove the request by ID
            currentUser.connectionRequests = currentUser.connectionRequests.filter(
                id => id.toString() !== req.params.id.toString()
            );

            await currentUser.save();

            return res.status(200).json(
                this.responseGenerator(null, 200, "Connection request has been rejected.")
            );
        } catch (error) {
            throw new Error(error);
        }
    });

    static getUserAdministrator = asyncHandler(async (req, res) => {
        try {
            const user = req.user;
            const loggedInUserRole = await rolesModel.findById(user.role_id);

            if (!loggedInUserRole) {
                res.status(404);
                throw new Error("User role does not exist");
            }

            let assignedCompanyId = "";
            const { companyId } = req.query;
            if (loggedInUserRole.key === "superadmin") {
                if (!companyId) {
                    res.status(400);
                    throw new Error("Company ID is required for superadmin");
                }
                assignedCompanyId = companyId;
            } else if (loggedInUserRole.key === "admin") {
                assignedCompanyId = user.company_id;
            } else {
                res.status(400);
                throw new Error("method not allowed for this role");
            }

            let page = req.query.page ? Number(req.query.page) : 1;
            let limit =
                req.query.limit && Number(req.query.limit) <= 1000
                    ? Number(req.query.limit)
                    : 20;
            let skip = 0;
            if (page > 1) {
                skip = (page - 1) * limit;
            }
            let sort = req.query.sort ? Number(req.query.sort) : -1;

            const adminRole = await rolesModel.findOne({
                is_deleted: false,
                key: "admin",
            });
            if (!adminRole) {
                res.status(404);
                throw new Error("No admin role found");
            }

            const admins = await userModel.aggregate([
                {
                    $match: {
                        is_deleted: false,
                        role_id: adminRole._id,
                        company_id: new ObjectId(assignedCompanyId),
                    },
                },
                {
                    $lookup: {
                        from: "tbl_roles",
                        localField: "role_id",
                        foreignField: "_id",
                        as: "role"
                    }
                },
                { $unwind: "$role" },
                { $sort: { createdAt: sort } },
                { $skip: skip },
                { $limit: limit },
            ]);
            const totalCount = await userModel.countDocuments({
                is_deleted: false,
                role_id: adminRole._id,
                company_id: new ObjectId(assignedCompanyId),
            });

            if (admins.length > 0) {
                return res.status(200).json(
                    this.responseGenerator(
                        {
                            totalcount: totalCount,
                            users: admins,
                            page: page,
                            limit: limit
                        },
                        200
                    )
                );
            } else {
                res.status(404);
                throw new Error("No admins found for this company");
            }
        } catch (error) {
            throw new Error(error);
        }
    });

    static unFriendUser = asyncHandler(async (req, res) => {
        try {
            const loginUserId = req.user.id;
            const targetUserId = req.params.id;

            // Fetch both users
            const loginUser = await userModel.findById(loginUserId);
            const targetUser = await userModel.findById(targetUserId);

            if (!loginUser || !targetUser) {
                res.status(404);
                throw new Error("User not found");
            }

            const isFriend = loginUser.connections.includes(targetUserId);
            if (!isFriend) {
                res.status(400);
                throw new Error("You are not connected with this user");
            }

            // Remove each other from connections
            loginUser.connections.pull(targetUserId);
            targetUser.connections.pull(loginUserId);

            await loginUser.save();
            await targetUser.save();

            return res
                .status(200)
                .json(this.responseGenerator(null, 200, "User has been unfriended."));
        } catch (err) {
            throw new Error(err);
        }
    });

    static getUserByID = asyncHandler(async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await userModel
                .findOne({ _id: userId, is_deleted: false })
                .populate("company_id picture role_id");
            if (!user) {
                res.status(404);
                throw new Error("User not found");
            }
            res.status(200).json(this.responseGenerator(user, 200, "The user has been found."));
        } catch (error) {
            throw new Error(error);
        }
    });

    static deleteUser = asyncHandler(async (req, res) => {
        try {
            const logInuserId = req.user;
            const loggedInUserRole = await rolesModel.findById(logInuserId.role_id);


            if (!loggedInUserRole) {
                res.status(404);
                throw new Error("User role does not exist");
            }

            if (!["superadmin", "admin"].includes(loggedInUserRole.key)) {
                res.status(403);
                throw new Error("You are not allowed to perform this action");
            }

            const userIdToDelete = req.params.id;
            const checkRole = await userModel.findById(userIdToDelete);
            const isPilotUser = await rolesModel.findOne({ _id: checkRole.role_id });

            if (isPilotUser.key == "pilot") {

                const deletePilot = await pilotProfileModel.findOneAndUpdate(
                    { userId: userIdToDelete, is_deleted: false },
                    { is_deleted: true },
                    { new: true }
                )
                if (!deletePilot) {
                    res.status(400);
                    throw new Error("Error while deleting the pilot");
                }

                const deleteLogBook = await flightLogBook.findOneAndUpdate(
                    { userId: userIdToDelete, is_deleted: false },
                    { is_deleted: true },
                    { new: true }
                );

                if (!deleteLogBook) {
                    res.status(400);
                    throw new Error("Error while deleting the logbook");
                }
            }

            const userToDelete = await userModel.findOne({
                _id: userIdToDelete,
                is_deleted: false,
            });
            if (!userToDelete) {
                res.status(404);
                throw new Error("User not found");
            }

            const deletedUser = await userModel.findOneAndUpdate(
                { _id: userIdToDelete, is_deleted: false },
                { is_deleted: true },
                { new: true }
            );

            if (!deletedUser) {
                res.status(404);
                throw new Error("Failed to delete user");
            }

            return res
                .status(200)
                .json(this.responseGenerator(null, 200, "The user has been deleted successfully."));
        } catch (error) {
            throw new Error(error);
        }
    });

    // Delete user Account to be deleted
    static deleteAccount = asyncHandler(async (req, res) => {
        try {
            const logInuserId = req.user;
            const [userDetails, loggedInUserRole] = await Promise.all([
                userModel.findOne({ is_deleted: false, _id: logInuserId._id }),
                rolesModel.findById(logInuserId.role_id)
            ])

            if (!userDetails) {
                res.status(404);
                throw new Error("User not found");
            }
            if (!loggedInUserRole) {
                res.status(404);
                throw new Error("User role does not exist");
            }

            // ************************************User deletion logic********************************************

            const deleteUser = await userModel.findOneAndUpdate(
                { _id: logInuserId._id, is_deleted: false },
                { is_deleted: true },
                { new: true }
            )

            if (!deleteUser) {
                res.status(400);
                throw new Error("Error while deleting the user");
            }

            if (loggedInUserRole.key === "pilot") {

                const deletePilot = await pilotProfileModel.findOneAndUpdate(
                    { userId: logInuserId._id, is_deleted: false },
                    { is_deleted: true },
                    { new: true }
                )
                if (!deletePilot) {
                    res.status(400);
                    throw new Error("Error while deleting the pilot");
                }

                const deleteLogBook = await flightLogBook.findOneAndUpdate(
                    { userId: logInuserId._id, is_deleted: false },
                    { is_deleted: true },
                    { new: true }
                );

                if (!deleteLogBook) {
                    res.status(400);
                    throw new Error("Error while deleting the logbook");
                }

                return res
                    .status(200)
                    .json(
                        this.responseGenerator(
                            null,
                            200,
                            "Account has been deleted successfully."
                        )
                    );

            } else if (loggedInUserRole.key === "admin") {

                const companyDelete = await companyModel.findOneAndUpdate(
                    { is_deleted: false, _id: logInuserId.company_id },
                    { is_deleted: true },
                    { new: true }
                )

                if (!companyDelete) {
                    res.status(400);
                    throw new Error("Error while deleting the company");
                }

                return res
                    .status(200)
                    .json(
                        this.responseGenerator(
                            null,
                            200,
                            "Employeer Account has been deleted successfully."
                        )
                    );
            } else if (loggedInUserRole.key === "contentcreator") {

                const deleteCreator = await creatorModel.findOneAndUpdate({ is_deleted: false, user_id: logInuserId._id });
                if (!deleteCreator) {
                    res.status(400);
                    throw new Error("Error while deleting the Creator");
                }

                return res
                    .status(200)
                    .json(
                        this.responseGenerator(
                            null,
                            200,
                            "Creator Account has been deleted successfully."
                        )
                    );

            } else if (loggedInUserRole.key === "consultant") {

                const deleteConsultant = await consultantModel.findOneAndUpdate({ is_deleted: false, user_id: logInuserId._id });
                if (!deleteConsultant) {
                    res.status(400);
                    throw new Error("Error while deleting the Consultant");
                }

                return res
                    .status(200)
                    .json(
                        this.responseGenerator(
                            null,
                            200,
                            "Consultant Account has been deleted successfully."
                        )
                    );
            } else {
                res.status(400);
                throw new Error("No role found")
            }

        } catch (error) {
            throw new Error(error);
        }
    });

    static editProfile = asyncHandler(async (req, res) => {
        try {
            const loggedInUser = req.user;
            const {
                first_name,
                last_name,
                email,
                city,
                country,
                zip_code,
                description,
                phone_number,
            } = req.body;

            const user = await userModel.findOne({
                is_deleted: false,
                _id: loggedInUser._id,
            });
            if (!user) {
                res.status(404);
                throw new Error("User not found");
            }

            const updatedUser = await userModel.findByIdAndUpdate(
                loggedInUser._id,
                {
                    first_name,
                    last_name,
                    city,
                    phone_number,
                    country,
                    zip_code,
                    description,
                    phone_number,
                },
                { new: true }
            );
            if (!updatedUser) {
                res.status(400);
                throw new Error("Error while updating ");
            }

            return res
                .status(200)
                .json(
                    this.responseGenerator(
                        null,
                        200,
                        "Account information has been updated successfully."
                    )
                );
        } catch (e) {
            throw new Error(e);
        }
    });

    static newPassword = asyncHandler(async (req, res) => {
        try {
            const loggedInUser = req.user;

            const user = await userModel
                .findOne({ is_deleted: false, _id: loggedInUser._id })
                .select("+password");
            if (!user) {
                res.status(404);
                throw new Error("User not found");
            }

            const { newPassword, current_password } = req.body;
            if (!newPassword || !current_password) {
                res.status(400);
                throw new Error("Please enter required fields.");
            }
            if (user && (await bcrypt.compare(current_password, user.password))) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                const updatedprofile = await userModel.findByIdAndUpdate(
                    user._id,
                    { password: hashedPassword },
                    { new: true }
                );
                if (!updatedprofile) {
                    res.status(400);
                    throw new Error("Error updating password");
                }

                // add notification code here
                 const fcmRecord = await fcmModel.findOne({ user_id: loggedInUser._id });
                 
                   if (fcmRecord?.fcm_token) {
                 
                        let notificationTitle = "Password Updated";
                        let notificationBody = "You have updated your password.Contact the Help Center if you feel you are not doing it.";
            
                        let createNotification = await notificationModel.create({
                            user_id: loggedInUser._id,
                            title: notificationTitle,
                            body: notificationBody,
                            notification_type:"general",
                            isRead: false
                        });
            
                        if (!createNotification) {
                            res.status(400);
                            throw new Error("Error while creating the notification");
                        }
            
                        await fcmController.passwordChange(fcmRecord.fcm_token);
            
                    }
                //  ending notification code here 



                // email code added here
                    
                console.log("I am entering here");
                

                // let subject = `Your Password Has Been Updated, ${user.first_name} 🔐`;
                // let message = `
                //     <p>Hi ${user.first_name},</p><br/>
                //     <p>This is a confirmation that your <strong>FlyHire</strong> account password was successfully changed.</p>
                    
                //     <p>If you made this change, no further action is required. ✅</p>
                //     <p>If you did <strong>not</strong> change your password, please reset it immediately and contact our support team.</p>
                    
                //     <br/>
                //     <p style="margin-bottom: 20px;">
                //         <a href="${process.env.SITE_DOMAIN}/forgot-password" style="display: inline-block; padding: 10px 20px; background-color: #0f5fb6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                //             Reset Password
                //         </a>
                //     </p>
                    
                //     <br/>
                //     <p>Keeping your account secure is our top priority.</p>
                //     <p>— The FlyHire Security Team ✈️</p>
                // `;

                // sendEmail(user.email, subject, message);

                // console.log("Email code ended here.");
                

                // email code ended here
                return res
                    .status(200)
                    .json(
                        this.responseGenerator(
                            null,
                            200,
                            "Password has been updated successfully."
                        )
                    );
            } else {
                res.status(400);
                throw new Error("Invalid Current Password");
            }
        } catch (e) {
            throw new Error(e);
        }
    });

    static changeUserStatus = asyncHandler(async (req, res) => {
        try {
            const userId = req.params.id;
            const { status } = req.body;

            const isRoleExist = await rolesModel.findOne({ _id: req.user.role_id });
            if (!isRoleExist) {
                res.status(404);
                throw new Error("User role does not exist");
            }

            if (!["superadmin", "admin"].includes(isRoleExist.key)) {
                res.status(403);
                throw new Error("You are not allowed to perform this action");
            }

            const user = await userModel.findOne({ _id: userId, is_deleted: false });
            if (!user) {
                res.status(404);
                throw new Error("user not found");
            }

            user.status = status;
            await user.save();

            return res
                .status(200)
                .json(
                    this.responseGenerator(
                        null,
                        200,
                        `User status updated to ${status} successfully`
                    )
                );
        } catch (error) {
            throw new Error(error);
        }
    });

    static uploadUserPicture = asyncHandler(async (req, res) => {
        try {
            const loggedInUser = req.user;
            const mediaId = req.mediaId;

            if (!mediaId) {
                res.status(400);
                throw new Error("Media ID is missing");
            }

            const user = await userModel.findById(loggedInUser._id);

            if (user.picture) {
                const media = await mediaModel.findById(user.picture);
                if (!media) {
                    res.status(404);
                    throw new Error("Media not found or already deleted");
                }
                const oldImagePath = path.join(__dirname, "..", media.file_url);

                await fs.unlink(oldImagePath);
                await mediaModel.findByIdAndDelete({ _id: user.picture });

                await userModel.findByIdAndUpdate(loggedInUser._id, { picture: null });
            }

            //    ending of if condition
            const pictureUpdated = await userModel.findOneAndUpdate(
                { _id: loggedInUser._id, is_deleted: false },
                { picture: mediaId },
                { new: true }
            );

            if (!pictureUpdated) {
                res.status(404);
                throw new Error("User not found");
            }

            return res
                .status(200)
                .json(
                    this.responseGenerator(
                        pictureUpdated,
                        200,
                        "Picture uploaded successfully"
                    )
                );
        } catch (e) {
            throw new Error(e);
        }
    });

    static superadminChangeUserDetails = asyncHandler(async (req, res) => {
        try {
            const { action } = req.body;
            if (action == 'change-user-details-with-password') {
                const { first_name, last_name, password, user } = req.body;

                // Hash password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const updatedprofile = await userModel.findByIdAndUpdate(user, { first_name: first_name, last_name: last_name, password: hashedPassword })
                if (updatedprofile) {
                    res.status(200).json(this.responseGenerator(
                        null,
                        200,
                        "User information has been updated successfully"
                    ))
                } else {
                    res.status(400)
                    throw new Error('Error updating profile')
                }
            } else if (action == 'change-user-details-without-password') {
                const { user, first_name, last_name } = req.body;

                const updatedprofile = await userModel.findByIdAndUpdate(user, { first_name: first_name, last_name: last_name })
                if (updatedprofile) {
                    res.status(200).json(this.responseGenerator(
                        null,
                        200,
                        "User information has been updated successfully"
                    ))
                } else {
                    res.status(400)
                    throw new Error('Error updating profile')
                }
            } else {
                res.status(400)
                throw new Error('No Method Allowed')
            }
        } catch (e) {
            throw new Error(e);
        }
    });

    static getActivePlans = asyncHandler(async (req, res) => {
        try {

            const active_plans = await Subscription.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$user_id', req.user._id] },
                                { $eq: ['$isDeleted', false] },
                                { $eq: ['$paid', true] }
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "tbl_prices",
                        localField: "plan_id",
                        foreignField: "_id",
                        as: "plan",
                    }
                },
                {
                    "$addFields": {
                        "plan": {
                            "$arrayElemAt": ["$plan", 0]
                        }
                    }
                },
            ]);

            if (!active_plans || active_plans.length <= 0) {
                res.status(404).json(this.responseGenerator({}, 404, "", 'No plan subscribed.'));
                return;
            }

            res.status(200).json(this.responseGenerator(active_plans, 200));


        } catch (error) {
            res.status(400);
            throw new Error(error);
        }
    });

    // ************************************Send User email****************************************************

    static sendEmails = asyncHandler(async (req, res) => {
        try {

            const { emails, subject, message } = req.body;

            if (!emails || !subject || !message) {
                res.status(400);
                throw new Error("Enter the require field");
            }

            const isRoleExist = await rolesModel.findOne({ _id: req.user.role_id });
            if (!isRoleExist) {
                res.status(404);
                throw new Error("User role does not exist");
            }

            if (isRoleExist.key !== "superadmin") {
                res.status(403);
                throw new Error("You are not allowed for this method");
            }
            const emailSent = await sendEmail(emails, subject, message);

            if (emailSent) {
                return res.status(200).json(this.responseGenerator(null, 200, "Emails has been sent successfully."));
            } else {
                res.status(400);
                throw new Error("Failed to send email. Please try again.");
            }


        } catch (err) {
            throw new Error(err);
        }
    });

    // static getAllUsers = asyncHandler(async (req, res) => {
    //     try {

    //         const loginUser = req.user;

    //         const limit = req.query.limit && Number(req.query.limit) <= 50 ? Number(req.query.limit) : 9;
    //         const page = req.query.page ? Number(req.query.page) : 1;
    //         const sort = req.query.sort ? Number(req.query.sort) : -1;
    //         let skip = 0;
    //         if (page > 1) {
    //             skip = (page - 1) * limit;
    //         }

    //         const loginUserDetails = await userModel.findById(req.user.id);
    //         if (!loginUserDetails) {
    //             res.status(401);
    //             throw new Error("User not found or unauthorized");
    //         }

    //         const connectionRequestIds = (loginUserDetails.sentRequest || []).map(
    //             id => new mongoose.Types.ObjectId(id)
    //         );
    //         console.log("connectionRequestIds", connectionRequestIds);


    //         const matchStage = {
    //             // _id: { $ne: loginUser._id },
    //             is_deleted: false,
    //             status: true
    //         };


    //         const userList = await userModel.aggregate([
    //             { $match: matchStage },
    //             {
    //                 $lookup: {
    //                     from: "tbl_medias",
    //                     localField: "picture",
    //                     foreignField: "_id",
    //                     as: "mediaDetails"
    //                 }
    //             },
    //             // ma ny ki sent request wo gayee next user ki connection request ma okay

    //             {
    //                 $addFields: {
    //                     isRequestSent: {
    //                         $in: ["$_id", connectionRequestIds]
    //                     }
    //                 }
    //             },

    //             { $sort: { createdAt: sort } },
    //             { $skip: skip },
    //             { $limit: limit },
    //             {
    //                 $project: {
    //                     first_name: 1,
    //                     last_name: 1,
    //                     email: 1,
    //                     city: 1,
    //                     country: 1,
    //                     zip_code: 1,
    //                     description: 1,
    //                     phone_number: 1,
    //                     status: 1,
    //                     company_id: 1,
    //                     token: 1,
    //                     mediaDetails: 1,
    //                     isRequestSent: 1
    //                 }
    //             },

    //         ]);
    //         // 
    //         if (userList && userList.length > 0) {
    //             let jobsCount = await userModel.aggregate([
    //                 { $match: matchStage },
    //                 { $count: "total_count" },
    //             ]);
    //             let a = 0;
    //             if (jobsCount.length > 0) {
    //                 a = jobsCount[0].total_count;
    //             }
    //             return res.status(200).json(this.responseGenerator({
    //                 list: userList,
    //                 page: page,
    //                 limit: limit,
    //                 total: a,

    //             }, 200));
    //         } else {
    //             res.status(404);
    //             throw new Error("users not found");
    //         }


    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // });

    // const mongoose = require("mongoose");

    static getAllUsers = asyncHandler(async (req, res) => {
        try {
            const limit = req.query.limit && Number(req.query.limit) <= 50 ? Number(req.query.limit) : 9;
            const page = req.query.page ? Number(req.query.page) : 1;
            const sort = req.query.sort ? Number(req.query.sort) : -1;
            const skip = page > 1 ? (page - 1) * limit : 0;

            const loginUserDetails = await userModel.findById(req.user.id);
            if (!loginUserDetails) {
                res.status(401);
                throw new Error("User not found or unauthorized");
            }
            // ✅ Convert all to ObjectId
            const connectionRequestIds = (loginUserDetails.sentRequest || []).map(id =>
                new mongoose.Types.ObjectId(id.toString())
            );



            const matchStage = {
                _id: { $ne: loginUserDetails._id }, // ✅ Exclude self
                is_deleted: false,
                status: true
            };

            const userList = await userModel.aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: "tbl_pilot_profiles",
                        localField: "_id",
                        foreignField: "userId",
                        as: "pilotProfileDetails"
                    }
                },
                {
                    $lookup: {
                        from: "tbl_companies",
                        localField: "company_id",
                        foreignField: "_id",
                        as: "adminCompanyDetails"
                    }
                },
                {
                    $lookup: {
                        from: "tbl_roles",
                        localField: "role_id",
                        foreignField: "_id",
                        as: "roleDetails"
                    }
                },
                {
                    $lookup: {
                        from: "tbl_medias",
                        localField: "picture",
                        foreignField: "_id",
                        as: "mediaDetails"
                    }
                },
                {
                    $addFields: {
                        isRequestSent: {
                            $in: ["$_id", connectionRequestIds]
                        }
                    }
                },

                { $sort: { createdAt: sort } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        city: 1,
                        country: 1,
                        zip_code: 1,
                        description: 1,
                        phone_number: 1,
                        status: 1,
                        company_id: 1,
                        token: 1,
                        mediaDetails: 1,
                        isRequestSent: 1,
                        PilotcompanyName: {
                            $map: {
                                input: {
                                    $ifNull: [
                                        { $arrayElemAt: ["$pilotProfileDetails.employmentHistory", 0] },
                                        []
                                    ]
                                },
                                as: "job",
                                in: "$$job.company"
                            }
                        },
                        adminCompanyName: {
                            $ifNull: [
                                [{ $arrayElemAt: ["$adminCompanyDetails.name", 0] }],
                                []
                            ]
                        },
                        Designation: { $arrayElemAt: ["$roleDetails.name", 0] }


                    }
                },

                // { $sort: { createdAt: sort } },
                // { $skip: skip },
                // { $limit: limit },

            ]);

            const countResult = await userModel.aggregate([
                { $match: matchStage },
                { $count: "total_count" }
            ]);
            const total = countResult.length > 0 ? countResult[0].total_count : 0;

            if (userList && userList.length > 0) {
                return res.status(200).json(
                    this.responseGenerator({
                        list: userList,
                        page,
                        limit,
                        total
                    }, 200)
                );
            } else {
                res.status(404);
                throw new Error("Users not found");
            }
        } catch (err) {
            console.error("getAllUsers error:", err);
            res.status(500);
            throw new Error(err.message || "Internal Server Error");
        }
    });

    // Data change
    static chnageSatatus = asyncHandler(async (req, res) => {
        try {
            const loginUser = req.user;
            const { action, status } = req.body;

            // const roleDetails = await rolesModel.findById(loginUser.role_id);
            // if (roleDetails.is_deleted) {
            //     res.status(404);
            //     throw new Error("Role not found.");
            // }

            // if (roleDetails.key != "pilot") {
            //     res.status(403);
            //     throw new Error("You are not allowed for this method");

            // }

            if (!action) {
                res.status(400);
                throw new Error("Required fields 'action' and 'status' are missing or invalid.");
            }

            let updateData = {};

            if (action === "jobMatching") {
                updateData = { jobMatchingEmail: status };
            } else if (action === "pushnotification") {
                updateData = { pushnotification: status };
            } else if (action === "newsNotifications") {
                updateData = { newsNotifications: status };
            } else if (action === "pilotProfileVisibility") {

                // const updatedPilot = await PilotProfileModel.findOne({ userId: loginUser._id });
                // console.log("updatedPilot", updatedPilot);
                const updatePilotVisibility = await pilotProfileModel.findOneAndUpdate(
                    { userId: loginUser._id },
                    { visibility: status },
                    { new: true }
                )

                if (!updatePilotVisibility) {
                    res.status(404);
                    throw new Error("No pilot found");
                }

                return res.status(200).json(this.responseGenerator(null, 200, "Pilot profile Visibility updated successfully."));
            } else if (action === "jobDraft") {
                const { job_id, isDraft } = req.body;

                if (!job_id) {
                    res.status(400);
                    throw new Error("Kindly provide the job id");
                }

                if (typeof isDraft !== "boolean") {
                    res.status(400);
                    throw new Error("Please provide a valid isDraft value (true or false).");
                }

                const job = await jobModel.findById(job_id);
                if (!job) {
                    res.status(400);
                    throw new Error("No job id found");
                }

                const updatedJob = await jobModel.findByIdAndUpdate(
                    job_id,
                    { isDraft },
                    { new: true }
                );

                if (!updatedJob) {
                    res.status(400);
                    throw new Error("Error while updating the job status.");
                }

                return res
                    .status(200)
                    .json(this.responseGenerator(null, 200, "Status has been changed successfully."));
            } else {
                res.status(400);
                throw new Error("Provide a valid action.");
            }

            const updatedUser = await userModel.findByIdAndUpdate(
                loginUser._id,
                { $set: updateData },
                { new: true }
            );

            if (!updatedUser) {
                res.status(404);
                throw new Error("User not found.");
            }

            return res.status(200).json(this.responseGenerator(null, 200, "status has been changed successfully."));


        } catch (err) {
            res.status(500);
            throw new Error(err);

        }
    });

}