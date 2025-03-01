import express from "express";
import { logout, signin, signup } from "../controllers/auth.controller.js";
const router = express.Router();


router.post("/signup",signup)
router.post("/logout",logout)
router.post("/signin",signin)



export default router