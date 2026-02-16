import asyncHandler from "express-async-handler";
import AuthController from "./authController.js";
import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";


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

  // Add to Cart option in it 

static addProductToCart = asyncHandler(async (req, res) => {
  const { product_id } = req.body;

  if (!product_id) {
    res.status(400);
    throw new Error("Provide product_id");
  }

  // Check valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    res.status(400);
    throw new Error("Invalid product id");
  }

  // Check product exists
  const product = await productModel.findOne({
    _id: product_id,
    is_deleted: false,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const userId = req.user.id; // JWT middleware se

  // Find user's cart
 
  let cart = await cartModel.findOne({ user: userId });

  // If cart does not exist
  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      items: [{ product: product_id, quantity: 1,price:product.price }],
    });

    res.status(200).json(
      this.responseGenerator(
        cart,
        200,
        "Product added to cart",
        
      )
    );

  }

  // !Check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === product_id
  );


  if (itemIndex > -1) {
    // Increase quantity
    cart.items[itemIndex].quantity += 1;
    cart.items[itemIndex].price +=product.price
  } else {
    // Add new product
    cart.items.push({ product: product_id, quantity: 1, price:product.price });
  }

  await cart.save();

  // res.status(200).json({
  //   success: true,
  //   message: "Product added to cart",
  //   data: cart,
  // });

      res.status(200).json(
      this.responseGenerator(
        cart,
        200,
        "Product added to cart",
        
      )
    );

});


}
