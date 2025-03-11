import { generateToken } from "../lib/utils";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
export const signup = ("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        //hash the password 
        //create the user
        //filtering password length less han 6
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long" });
        }
        //find user with the email alredy exist in databse
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json({ msg: "User already exist" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });
        if (newUser) {
            //generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                msg: "User created successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic

            });

        } else {
            res.status(400).json({ msg: "Failed to create user" });
        }


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    
    }
})
export const logout = ("/logout", (req, res) => {
    res.send("logout")
})
export const signin = ("/signin", (req, res) => {
    res.send("sigiin")
})
