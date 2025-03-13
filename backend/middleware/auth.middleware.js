import  jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {

    const token  = req.cookies.jwt;
    try {
        if(!token){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({msg:"Unauthorized"});
        }
        //assigning user to the request so if we want to work with
        //user dat awe just need to uti.lize this only
        req.user = user;
        next();
    }catch(error){
        return res.status(500).json({msg:"Internal Server Error"});

    }
}
