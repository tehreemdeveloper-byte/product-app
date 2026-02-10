import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import AuthController from "./authController.js";

import userModel from "../models/userModel.js";
import mediaModel from "../models/mediaModel.js";

export default class Accesscontroller extends AuthController {
    static checkStatus = asyncHandler(async (req, res) => {
        res.status(200).json(this.responseGenerator(null, 200, "API is Live"));
    });

    static validate = asyncHandler(async (req, res) => {
        try {
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith("Bearer")
            ) {
                const token = req.headers.authorization.split(" ")[1];
                let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

                const user = await userModel.findOne({
                    _id: decoded.id,
                    is_deleted: false,
                });

                if (!user) {
                    res.status(401);
                    throw new Error("user not found to validate");
                }

                if (user && user.status == true) {
                    const RoleExists = await roleModel.findOne({ _id: user.role_id });
                    let newtoken = this.tokenGenerator(user._id);
                    let picture = "";
                    if (user.picture) {
                        picture = await mediaModel.findById(user.picture);
                    }

                    if (RoleExists.key == "superadmin") {
                        res.status(200).json(
                            this.responseGenerator(
                                {
                                    id: user._id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    username: user.username,
                                    email: user.email,
                                    picture: picture,
                                    role_key: RoleExists.key,
                                    role_name: RoleExists.name,
                                },
                                200,
                                "Validated",
                                newtoken
                            )
                        );
                    } else if (RoleExists.key == "admin") {
                        const companyid = user.company_id;
                        const company = await companyModel.findById(companyid);

                        // if (company?.status == true && company?.is_deleted == false && company?.subscription_status === "Active") {

                        // const company = await companyModel.findOne({ _id: companyid, is_deleted: false });
                        // if (!company) {
                        //     res.status(404);
                        //     throw new Error("Company not found");
                        // }

                        res.status(200).json(
                            this.responseGenerator(
                                {
                                    id: user._id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    picture: picture,
                                    company_id: user.company_id,
                                    company_name: company?.name,
                                    role_key: RoleExists.key,
                                    role_name: RoleExists.name,
                                    on_boarding: user.onboarding,
                                    isVarified: user?.isVarified,
                                },
                                200,
                                "Validated",
                                newtoken
                            )
                        );
                        // }
                        // else {
                        //     if (company?.is_deleted == true) {
                        //         res.status(400)
                        //         throw new Error('Company has been deleted. You are not authorized for validation.')
                        //     }
                        //     if (company?.status == false) {
                        //         res.status(400)
                        //         throw new Error('Company has been inactive temporarily. To Reinitiate, contact customer support.')
                        //     }
                        //     if (company?.subscription_status == "Expired") {
                        //         res.status(400)
                        //         throw new Error('Your subscription has been Expired. Kindly renew your subscription')
                        //     }
                        // }
                    } else if (RoleExists.key == "pilot") {
                        // && user.payment_status == true
                        const isPilotExist = await PilotProfileModel.findOne({
                            userId: user._id,
                            is_deleted: false,
                        });
                        if (!isPilotExist) {
                            res.status(404);
                            throw new Error("Pilot not found");
                        }

                        if (user.status == true) {
                            res.status(200).json(
                                this.responseGenerator(
                                    {
                                        id: user._id,
                                        first_name: user.first_name,
                                        last_name: user.last_name,
                                        email: user.email,
                                        picture: picture,
                                        payment_status: user.payment_status,
                                        role_key: RoleExists.key,
                                        role_name: RoleExists.name,
                                        on_boarding: user?.onboarding,
                                        isVarified: user?.isVarified,
                                    },
                                    200,
                                    "Validated",
                                    newtoken
                                )
                            );
                        } else {
                            res.status(401);
                            throw new Error(
                                "you are inactive temporarily. To Reinitiate, contact customer support."
                            );
                            // if (user.payment_status == false) {
                            //     res.status(401)
                            //     throw new Error('Kindly upgrade your payment. You are not authorized for validation.')
                            // }
                            // if (user.status == false) {
                            //     res.status(401)
                            //     throw new Error('you are inactive temporarily. To Reinitiate, contact customer support.')
                            // }
                        }
                    } else if (RoleExists.key == "contentcreator") {
                        // if (!user.payment_staus) {
                        //     res.status(403);
                        //     throw new Error("Access denied. Please complete your payment to use this service.");
                        // }
                        const isCreatorExist = await CreatorModel.findOne({
                            user_id: user._id,
                            is_deleted: false,
                        });
                        if (!isCreatorExist) {
                            res.status(404);
                            throw new Error("Creator not found");
                        }
                        res.status(200).json(
                            this.responseGenerator(
                                {
                                    id: user._id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    picture: user.picture,
                                    role_key: RoleExists.key,
                                    role_name: RoleExists.name,
                                    on_boarding: user?.onboarding,
                                    isVarified: user?.isVarified,
                                },
                                200,
                                "Validated",
                                newtoken
                            )
                        );
                    } else if (RoleExists.key == "consultant") {
                        // if (!user.payment_staus) {
                        //     res.status(403);
                        //     throw new Error("Access denied. Please complete your payment to use this service.");
                        // }
                        const isConsultantExist = await ConsultantModel.findOne({
                            user_id: user._id,
                            is_deleted: false,
                        });
                        if (!isConsultantExist) {
                            res.status(404);
                            throw new Error("Consultant not found");
                        }

                        res.status(200).json(
                            this.responseGenerator(
                                {
                                    id: user._id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    picture: user.picture,
                                    role_key: RoleExists.key,
                                    role_name: RoleExists.name,
                                    on_boarding: user?.onboarding,
                                    isVarified: user?.isVarified,
                                },
                                200,
                                "Validated",
                                newtoken
                            )
                        );
                    } else {
                        res.status(401);
                        throw new Error("Role not defined to validate");
                    }
                } else {
                    res.status(401);
                    throw new Error("user found but not active");
                }
            } else {
                res.status(401);
                throw new Error("No token provided");
            }
        } catch (e) {
            res.status(401);
            throw new Error("Token not authorized", e);
            // console.error(e.message)
            // res.status(401);
            // throw new Error(e.message || "Token not authorized");
        }
    });

    static register = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                res.status(400);
                throw new Error("Please add all fields");
            }
            const userExists = await userModel.findOne({
                email: email.toLowerCase(),
                is_deleted: false,
            });
            if (userExists) {
                res.status(409);
                throw new Error("User already exists");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await userModel.create({
                email: email.toLowerCase(),
                password: hashedPassword,
            });

            if (!user) {
                res.status(400);
                throw new Error("Error while creating user");
            }

            const pilotProfile = await PilotProfileModel.create({
                personalInfo: {
                    firstName: first_name,
                    lastName: last_name,
                    emailAddress: email.toLowerCase(),
                },
                userId: user._id,
            });

            const logBook = await FlightLogbookModel.create({
                userId: user._id,
            });

            if (!logBook) {
                res.status(400);
                throw new Error("Error while creating logBook");
            }
            if (!pilotProfile) {
                res.status(400);
                throw new Error("Error while creating pilot profile");
            }

            let newtoken = this.tokenGenerator(user._id);

            //email code started here
            let subject = `Hey ${first_name}, welcome to FlyHire! 🚀`;
            let message = `
                    <p>Hey ${first_name},</p> <br/>
                    <p>You just took off on the easiest job search of your life. <strong>FlyHire</strong> matches you with real jobs from top aviation employers—no fluff, no wasted time.</p>
                    <h3>Next Steps:</h3>
                    <ul>
                    <li> Complete your profile for better job matches.</li>
                    <li> Set your job preferences (aircraft, salary, location, etc.).</li>
                    <li> Start applying—your dream job could be a click away!</li>
                    </ul>
                    <p>
                   <a href="${process.env.SITE_DOMAIN}/pilot/configration">Complete Your Profile Now</a>
                   <br/> 
                   </p>

                       <p>
                <a href="${process.env.SITE_DOMAIN}" 
                style="display: inline-block; padding: 10px 20px; background-color: #0f5fb6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Explore the Site
                </a>

                 </p><br/>  
                    <p>Blue skies ahead,</p>
                    <p>— The FlyHire Crew ✈️</p>
                `;

            // Send email
            const emailSent = sendEmail(email, subject, message);
            if (!emailSent) {
                res.status(400);
                throw new Error("Failed to send email. Please try again.");
                // return res.status(200).json(this.responseGenerator(null, 200, "Welcome email has been sent."));
            }

            res.status(200).json(
                this.responseGenerator(
                    {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role_key: RoleExists.key,
                        role_name: RoleExists.name,
                    },
                    200,
                    "You’ve successfully entered FlyHire.",
                    newtoken
                )
            );

            // email code ended here
        } catch (e) {
            throw new Error(e);
        }
    });

    static registerAccounts = asyncHandler(async (req, res) => {
        try {
            const { first_name, last_name, email, password, role_key, ref } =
                req.body;

            if (!first_name || !last_name || !email || !password || !role_key) {
                res.status(400);
                throw new Error("All required fields must be provided");
            }

            const existingUser = await userModel.findOne({
                email: email.toLowerCase(),
                is_deleted: false,
            });
            if (existingUser) {
                res.status(409);
                throw new Error("User already exists");
            }

            const role = await roleModel.findOne({ key: role_key });
            if (!role) {
                res.status(404);
                throw new Error("Role not found");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // let otp = await this.generateOTP();

            let { otp, expiration_time } = this.generateOTP();

            const user = await userModel.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role_id: role._id,
                payment_status: true,
                otp,
                expiration_time,
                ref: ref,
            });

            if (!user) {
                res.status(400);
                throw new Error("Error creating user");
            }

            pilotProfileController.updateStepFunction(user._id, 1, "signup", false);

            // Pilot-specific onboarding
            if (role_key == "pilot") {
                const pilotProfile = await PilotProfileModel.create({
                    personalInfo: {
                        firstName: first_name,
                        lastName: last_name,
                        emailAddress: email.toLowerCase(),
                    },
                    userId: user._id,
                });



                const logBook = await FlightLogbookModel.create({ userId: user._id });

                if (!pilotProfile || !logBook) {
                    res.status(400);
                    throw new Error(
                        "Error creating pilot profile or logbook or pilot resume"
                    );
                }

                pilotProfileController.updateStepFunction(
                    user._id,
                    1,
                    "signup-pilot",
                    false
                );
            }

            //  content creator-specific onboarding
            if (role_key == "contentcreator") {
                const creatorProfile = await CreatorModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email.toLowerCase(),
                    user_id: user._id,
                });

                if (!creatorProfile) {
                    res.status(400);
                    throw new Error("Error creating content creator profile");
                }

                const updatePaymentStatus = await CreatorModel.findOneAndUpdate(
                    { _id: creatorProfile._id },
                    { payment_status: true },
                    { new: true }
                );
                if (!updatePaymentStatus) {
                    res.status(400);
                    throw new Error("Error while updating the payment status");
                }

                pilotProfileController.updateStepFunction(
                    user._id,
                    1,
                    "signup-contentcreator",
                    false
                );
            }

            //  consultant-specific onboarding
            if (role_key == "consultant") {
                const consultantProfile = await ConsultantModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email.toLowerCase(),
                    user_id: user._id,
                });

                if (!consultantProfile) {
                    res.status(400);
                    throw new Error("Error creating consultant profile");
                }

                const updatedPaymentStatus = await ConsultantModel.findOneAndUpdate(
                    { _id: consultantProfile._id },
                    { payment_status: true },
                    { new: true }
                );
                if (!updatedPaymentStatus) {
                    res.status(400);
                    throw new Error("Error while updating the payment status");
                }

                pilotProfileController.updateStepFunction(
                    user._id,
                    1,
                    "signup-consultant",
                    false
                );
            }

            const token = this.tokenGenerator(user._id);

            let subject = "";
            let message = "";

            if (role_key == "pilot") {
                subject = `Hey ${first_name}, welcome to FlyHire! 🚀`;
                message = `
                <p>Hey ${first_name},</p><br/>
                <p>You just took off on the easiest job search of your life. <strong>FlyHire</strong> matches you with real jobs from top aviation employers—no fluff, no wasted time.</p>
                <h3>Next Steps:</h3>
                <ul>
                    <li>Complete your profile for better job matches.</li>
                    <li>Set your job preferences (aircraft, salary, location, etc.).</li>
                    <li>Start applying—your dream job could be a click away!</li>
                </ul>
                <br/>
                    <p> Your verification code(OTP) is: <strong>${otp}</strong></p>
                <br/>
                <p style="margin-bottom: 20px;" >
                <a href="${process.env.SITE_DOMAIN}/pilot/configration">Complete Your Profile Now</a>
                </p>
                <br/>
                <p>
                    <a href="${process.env.SITE_DOMAIN}" style="display: inline-block; padding: 10px 20px; background-color: #0f5fb6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Explore the Site
                    </a>
                </p><br/>
                <p>Blue skies ahead,</p>
                <p>— The FlyHire Crew ✈️</p>`;
                // const otpMessage = `<p>Your verification code (OTP) is: <strong>${otp}</strong></p>`;
                // message += otpMessage;
            } else if (role_key == "admin") {
                subject = `Welcome to FlyHire, ${first_name}! 🚀`;
                message = `
                <p>Hi ${first_name},</p><br/>
                <p>We’re excited to have you on board! With <strong>FlyHire</strong>, you can find top-tier pilots faster and easier than ever.</p>
                <ul>
                    <li>✅ Post job listings in minutes</li>
                    <li>✅ Get AI-powered candidate matches</li>
                    <li>✅ Manage hiring seamlessly</li>
                </ul>
                <br/>
                    <p style="font-size: 24px;">Your verification code (OTP) is: <strong>${otp}</strong></p>
                <br/>

                <p style="margin-bottom: 20px;" ><a href="${process.env.SITE_DOMAIN}/admin/job-list">Post Your First Job</a></p>
                <p>
                    <a href="${process.env.SITE_DOMAIN}" style="display: inline-block; padding: 10px 20px; background-color: #0f5fb6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Explore the Site
                    </a>
                </p><br/>
                <p>Fly Higher,</p>
                <p><strong>- The FlyHire Crew ✈️</strong></p>
              `;
                // const otpMessage = `<p>Your verification code (OTP) is: <strong>${otp}</strong></p>`;
                // message += otpMessage;
            }

            if (subject && message) {
                sendEmail(email, subject, message);
            }

            res.status(200).json(
                this.responseGenerator(
                    {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role_key: role.key,
                        role_name: role.name,
                        // company_name: company?.name || null,
                        // company_id: company?._id || null
                    },
                    200,
                    "You are successfully registered.",
                    token
                )
            );
        } catch (err) {
            throw new Error(err);
        }
    });

    static login = asyncHandler(async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400);
                throw new Error("Email and password are required");
            }

            const user = await userModel
                .findOne({ email: email.toLowerCase(), is_deleted: false })
                .select("+password");
            if (!user) {
                res.status(404);
                throw new Error("User not found");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400);
                throw new Error("Invalid credentials");
            }

            if (!user.status) {
                res.status(403);
                throw new Error("You are inactive temporarily. Contact support.");
            }

            const token = this.tokenGenerator(user._id);

            if (!user.isVarified) {
                let { otp, expiration_time } = await this.generateOTP();
                user.otp = otp;
                user.expiration_time = expiration_time;
                await user.save();

                let subject = `Your FlyHire Verification Code is Here, ${user.first_name}! ✈️`;
                let message = `
                    <p>Hey ${user.first_name},</p><br/>
                    <p>Welcome aboard <strong>FlyHire</strong> — where your aviation career takes flight! 🛫</p>
                    <p>To get started, use the verification code below:</p>
                    <h2 style="color: #0f5fb6;">${otp}</h2>
                    <p>Enter this code to verify your email and continue setting up your profile.</p>
                    <br/>
                    <p style="margin-bottom: 20px;">
                        <a href="${process.env.SITE_DOMAIN}/pilot/configration">Complete Your Profile</a>
                    </p>
                    <p>
                        <a href="${process.env.SITE_DOMAIN}" style="display: inline-block; padding: 10px 20px; background-color: #0f5fb6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Visit FlyHire
                        </a>
                    </p><br/>
                    <p>Clear skies ahead,</p>
                    <p>— The FlyHire Crew ✈️</p>
                `;

                sendEmail(user.email, subject, message);

                return res
                    .status(200)
                    .json(
                        this.responseGenerator(
                            { isVarified: user.isVarified },
                            200,
                            "Your email is not verified. OTP has been sent to your email. Please verify your email.",
                            token
                        )
                    );
            }
            const RoleExists = await roleModel.findOne({ _id: user.role_id });
            if (RoleExists.key == "superadmin") {
                res.status(200).json(
                    this.responseGenerator(
                        {
                            id: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            picture: user.picture,
                            role_key: RoleExists.key,
                            role_name: RoleExists.name,
                        },
                        200,
                        "Login Successfully",
                        token
                    )
                );
            } else if (RoleExists.key == "admin") {
                // FEtch USer, onboarding = null. onboarding

                let onb = user.get("onboarding");

                if (onb != null || onb != undefined) {
                    return res
                        .status(200)
                        .json(
                            this.responseGenerator(onb, 200, "User On Board Step.", token)
                        );
                }
                else {

                    const companyid = user.company_id;
                    const company = await companyModel.findOne({
                        _id: companyid,
                        is_deleted: false,
                    });
                    if (!company) {
                        res.status(404);
                        throw new Error("Company not found");
                    }
                    if (
                        company.status == true &&
                        company.is_deleted == false &&
                        company.subscription_status === "Active"
                    ) {
                        return res.status(200).json(
                            this.responseGenerator(
                                {
                                    id: user._id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    picture: user.picture,
                                    company_id: user.company_id,
                                    company_name: company?.name,
                                    role_key: RoleExists.key,
                                    role_name: RoleExists.name,
                                    isVarified: user?.isVarified,
                                },
                                200,
                                "Login successfully",
                                token
                            )
                        );
                    } else {
                        if (company.is_deleted == true) {
                            res.status(400);
                            throw new Error(
                                "Company has been deleted. You are not authorized for validation."
                            );
                        }
                        if (company.status == false) {
                            res.status(400);
                            throw new Error(
                                "Company has been inactive temporarily. To Reinitiate, contact customer support."
                            );
                        }
                        if (company.subscription_status == "Expired") {
                            res.status(400);
                            throw new Error(
                                "Your subscription has been Expired. Kindly renew your subscription"
                            );
                        }
                    }



                }

                // only this flow will go otherwise 
            } else if (RoleExists.key == "contentcreator") {
                const isCreatorExist = await CreatorModel.findOne({
                    user_id: user._id,
                    is_deleted: false,
                });
                if (!isCreatorExist) {
                    res.status(404);
                    throw new Error("Creator not found");
                }
                res.status(200).json(
                    this.responseGenerator(
                        {
                            id: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            picture: user.picture,
                            role_key: RoleExists.key,
                            role_name: RoleExists.name,
                            isVarified: user?.isVarified,
                        },
                        200,
                        "Login successfully",
                        token
                    )
                );
            } else if (RoleExists.key == "consultant") {
                const isConsultantExist = await ConsultantModel.findOne({
                    user_id: user._id,
                    is_deleted: false,
                });
                if (!isConsultantExist) {
                    res.status(404);
                    throw new Error("Consultant not found");
                }
                res.status(200).json(
                    this.responseGenerator(
                        {
                            id: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            picture: user.picture,
                            role_key: RoleExists.key,
                            role_name: RoleExists.name,
                            isVarified: user?.isVarified,
                        },
                        200,
                        "Login successfully",
                        token
                    )
                );
            } else if (RoleExists.key == "pilot") {

                // adding a new code here
                let onb = user.get("onboarding");
                if (onb != null || onb != undefined) {
                    console.log("entering here");
                    console.log("I am onboard", onb);
                    return res
                        .status(200)
                        .json(
                            this.responseGenerator(onb, 200, "Object Working.", token)
                        );

                }

                // ending new code here
                const isPilotExist = await PilotProfileModel.findOne({
                    userId: user._id,
                    is_deleted: false,
                });
                if (!isPilotExist) {
                    res.status(404);
                    throw new Error("Pilot not found");
                }
                if (user.status == true) {
                    res.status(200).json(
                        this.responseGenerator(
                            {
                                id: user._id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                payment_status: user.payment_status,
                                picture: user.picture,
                                role_key: RoleExists.key,
                                role_name: RoleExists.name,
                                isVarified: user?.isVarified,
                            },
                            200,
                            "Login successfully",
                            token
                        )
                    );
                } else {
                    res.status(401);
                    throw new Error(
                        "you are inactive temporarily. To Reinitiate, contact customer support."
                    );
                }
            } else {
                res.status(400);
                throw new Error("Role not defined");
            }
        } catch (e) {
            throw new Error(e);
        }
    });

}
