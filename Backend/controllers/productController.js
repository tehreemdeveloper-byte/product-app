import asyncHandler from "express-async-handler";
import AuthController from "./authController.js";
import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";

import mongoose from 'mongoose';



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
 
  let cart = await cartModel.findOne({ user_id: userId });

  // If cart does not exist
  if (!cart) {
    cart = await cartModel.create({
      user_id: userId,
      items: [{ product: product_id, quantity: 1}],
    });

    return res.status(200).json(
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
    // cart.items[itemIndex].price +=product.price
  } else {
    // Add new product
    cart.items.push({ product: product_id, quantity: 1,  });
  }

  await cart.save();

  // res.status(200).json({
  //   success: true,
  //   message: "Product added to cart",
  //   data: cart,
  // });

    return  res.status(200).json(
      this.responseGenerator(
        cart,
        200,
        "Product added to cart",
        
      )
    );

});



// decrease quantity


static decreaseQuantity = asyncHandler(async (req, res) => {
  const { product_id } = req.body;
  const userId = req.user._id;

  if (!product_id) {
    res.status(400);
    throw new Error("product_id is required");
  }

  const cart = await cartModel.findOne({ user_id: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === product_id //for curly braces need to add the return keyword
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not in cart");
  }

  // Decrease quantity
  cart.items[itemIndex].quantity -= 1;

  // If quantity becomes 0 → remove item
  if (cart.items[itemIndex].quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  }

  await cart.save();

  // res.status(200).json({
  //   success: true,
  //   message: "Quantity updated",
  //   data: cart,
  // });

        res.status(200).json(
      this.responseGenerator(
        cart,
        200,
        "Quantity updated",
        
      )
    );

});


static getCart = asyncHandler(async (req, res) => {

   const loginUser = req.user.id || req.user._id;


  let limit = req.query.limit && Number(req.query.limit) <= 50 
    ? Number(req.query.limit) 
    : 9;

  let page = req.query.page ? Number(req.query.page) : 1;
  let skip = (page - 1) * limit;



  const cartLists = await cartModel.aggregate([

    {
  $match: { 
    user_id: new mongoose.Types.ObjectId(loginUser),
    is_deleted: false
  }
},


    { 
      $unwind: "$items" 
    },

    {
      $lookup: {
        from: "tbl_products", // collection name
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails"
      }
    },

    {
      $unwind: "$productDetails"
    },

    {
      $project: {
        _id: 0,
        product_id: "$productDetails._id",
        name: "$productDetails.name",
        quantity: "$items.quantity",
        price: "$productDetails.price",
        itemTotal: {
          $multiply: [
            "$items.quantity",
            "$productDetails.price"
          ]
        },
        image: "$productDetails.image"
      }
    },

    { $skip: skip },
    { $limit: limit }

  ]);

  const totalCount = await cartModel.aggregate([
    { $match: { user_id: loginUser } },
    { $unwind: "$items" },
    { $count: "total" }
  ]);

  const total = totalCount.length > 0 ? totalCount[0].total : 0;

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cartLists,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });

});

// {
//   $group: {
//     _id: null,
//     items: { $push: "$$ROOT" },
//     grandTotal: { $sum: "$itemTotal" }
//   }
// }




}
