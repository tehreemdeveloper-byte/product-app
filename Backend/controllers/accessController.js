import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import AuthController from "./authController.js";
import userModel from "../models/userModel.js";

export default class AccessController extends AuthController {

  // API Status Check
  static checkStatus = asyncHandler(async (req, res) => {
    res.status(200).json(
      this.responseGenerator(null, 200, "API is Live")
    );
  });

  // ✅ REGISTER
  static registerAccounts = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409);
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = this.tokenGenerator(user._id);

    res.status(201).json(
      this.responseGenerator(
        {
          id: user._id,
          name: user.fullName,
          email: user.email,
        },
        201,
        "User registered successfully",
        token
      )
    );
  });

  // ✅ LOGIN
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = this.tokenGenerator(user._id);

    res.status(200).json(
      this.responseGenerator(
        {
          id: user._id,
          name: user.fullName,
          email: user.email,
        },
        200,
        "Login successful",
        token
      )
    );
  });
}
