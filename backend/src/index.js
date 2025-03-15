import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import authRoutes from "../routes/auth.route.js";
import { connectDB } from "../lib/db.js";
import Message from "../models/message.model.js";
import messageRoutes from "../routes/message.route.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true   
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT , () => {
    console.log(`Running on https://localhost:${PORT}`);
    connectDB()
});
