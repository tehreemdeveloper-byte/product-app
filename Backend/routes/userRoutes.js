import { Router } from "express";
const router = Router();

import userController from "../controllers/userController.js";
import mediaController from "../controllers/mediaController.js";
import protect from "../middlewares/authMiddleware.js";

import { storage } from "../helpers/storage.js";


router.post('/addadmin', protect, userController.postAdmin);
router.post('/connect/:id', protect, userController.connectrequestuser);
router.post('/accept/:id', protect, userController.acceptuserrequest);
router.post('/reject/:id', protect, userController.rejectUserRequest);
router.post('/unfriend/:id', protect, userController.unFriendUser)

router.get('/companyadmin', protect, userController.getUserAdministrator);
router.get('/getalluser', protect, userController.getAlluserList);
router.get('/me', protect, userController.getUser);
router.get('/me/admin', protect, userController.getAdminDetails);
router.get('/plan', protect, userController.getActivePlans);
router.get('/:id', protect, userController.getUserByID);
router.get('/', protect, userController.getAllUsers);

router.patch('/status-change', protect, userController.chnageSatatus);
router.patch('/', protect, userController.editProfile);
router.patch('/emails', protect, userController.sendEmails);
router.patch('/upload', protect, storage, mediaController.uploadFile, userController.uploadUserPicture);
router.patch('/newpassword', protect, userController.newPassword);
router.patch('/superadmin/admindetails', protect, userController.superadminChangeUserDetails);
router.patch('/change/:id', protect, userController.changeUserStatus);

router.delete('/account-delete', protect, userController.deleteAccount);
router.delete('/:id', protect, userController.deleteUser);

export default router;



