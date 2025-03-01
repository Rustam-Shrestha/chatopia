import mongoose from "mongoose";
export const connectDB = async () => {
    
    try {
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log("connection with mongodb successful")
    } catch (error) {
        console.log("connection with mongodb unsuccessful"+error)
        
    }
}