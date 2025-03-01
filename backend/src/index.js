import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "../routes/auth.route.js";
import { connectDB } from "../lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Running on https://localhost:${PORT}`);
    connectDB()
});
