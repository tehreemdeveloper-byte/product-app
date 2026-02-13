import { Router } from "express";
import AccessController from "../controllers/accessController.js";

const router = Router();

// API Status
router.get("/", AccessController.checkStatus);

// Register
router.post("/register", AccessController.registerAccounts);

// Login
router.post("/login", AccessController.login);

export default router;
