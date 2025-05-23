import express from "express";
import { checkAuth, logout, signin, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();


router.post("/signup",signup)
router.get("/logout",logout)
router.post("/signin",signin)

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth)

export default router

