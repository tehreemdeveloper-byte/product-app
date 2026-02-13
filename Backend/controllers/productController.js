import asyncHandler from "express-async-handler";
import AuthController from "./authController.js";
import productModel from "../models/productModel.js";

export default class ProductController extends AuthController {

  // ✅ ADD PRODUCT
  static addProduct = asyncHandler(async (req, res) => {
    const { name, description, tags } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Product name is required");
    }

    const product = await productModel.create({
      name,
      description,
      tags,
    });

    res.status(201).json(
      this.responseGenerator(
        product,
        201,
        "Product added successfully"
      )
    );
  });

  // ✅ GET ALL PRODUCTS
  static getAllProducts = asyncHandler(async (req, res) => {
    const products = await productModel.find({
      is_deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(
      this.responseGenerator(
        products,
        200,
        "Products fetched successfully"
      )
    );
  });

}
