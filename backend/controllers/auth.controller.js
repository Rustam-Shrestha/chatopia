import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";  // Ensure file extension is .js
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    //if anything above mentioned is not present in req.body then it will throw error
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            // Generate JWT token
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
};


export const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide both email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        // Generate JWT token
        generateToken(user._id, res);
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const checkAuth = async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkauth"+error.message)
        res.status(500).json({ msg: "Server error" });
    }
}