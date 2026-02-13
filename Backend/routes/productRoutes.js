import { Router } from "express";
import ProductController from "../controllers/productController.js";

const router = Router();

router.post("/", ProductController.addProduct);

router.get("/", ProductController.getAllProducts);

export default router;
