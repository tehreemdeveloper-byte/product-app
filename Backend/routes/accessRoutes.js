import { Router } from "express";
const router = Router();

import protect from "../middlewares/authMiddleware.js";
import Accesscontroller from "../controllers/accessController.js";

router.get("/", Accesscontroller.checkStatus);
router.get("/validate", Accesscontroller.validate);
router.get('/user-step', protect, Accesscontroller.checkUserStep);

router.patch('/resent-otp', protect, Accesscontroller.resentOtpCode);

router.post('/verify-email', protect, Accesscontroller.verifyEmailOtp);
router.post('/registeraccount', Accesscontroller.registerAccounts);
router.post('/register', Accesscontroller.register);
router.post('/registeradmin', Accesscontroller.registerAdmin);

router.post('/login', Accesscontroller.login);
router.post('/forgot-password', Accesscontroller.forgotPassword);
router.post('/reset-password', Accesscontroller.resetPassword);
router.post('/change-password', protect, Accesscontroller.changePassword);

export default router;
