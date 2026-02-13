import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { errorhandler } from "./middlewares/errorMiddleware.js";

import accessRoutes from "./routes/accessRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// app.use("/user", userRoutes);

app.use("/api/auth", accessRoutes);
app.use("/api/product", productRoutes);


// Error Handler
app.use(errorhandler);

// Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
