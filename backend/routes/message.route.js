import express from "express";
import { checkAuth, logout, signin, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();


router.post("/users",protectRoute,getUsersForSidebar)
router.post("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage)
export default router

