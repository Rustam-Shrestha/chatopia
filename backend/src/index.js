import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import authRoutes from "../routes/auth.route.js";
import { connectDB } from "../lib/db.js";
import Message from "../models/message.model.js";
import messageRoutes from "../routes/message.route.js";
import cors from "cors";
import { app,server } from "../lib/socket.js";


const PORT = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined
app.use(express.json());
app.use(cookieParser());
// app.use(express.json({ limit: "1mb" }));
app.use(express.json({ limit: "50mb" })); // Increase the limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({
    origin: ["http://localhost:5173", "http://0.0.0.0:5173","http://192.168.1.65:5173"] ,
    credentials: true   
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT , "0.0.0.0", () => {
    console.log(`Running on https://localhost:${PORT}`);
    connectDB()
});
