import { Router } from "express";
import ProductController from "../controllers/productController.js";
import protect from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", ProductController.addProduct);

router.post("/add",protect,ProductController.addProductToCart)

router.get("/", ProductController.getAllProducts);
router.get("/cart",protect, ProductController.getCart);

router.patch("/decrement",protect,ProductController.decreaseQuantity)


export default router;
