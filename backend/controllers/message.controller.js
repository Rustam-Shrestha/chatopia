
import Message from "../models/message.model.js";
import User from "../models/user.model.js";  // Ensure file extension is .js



export const getUsersForSidebar = async (req, res) => {
    try {
        //fetch every user except me
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
            "-password"
        );
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
}
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id
        const messages = await Message.find({
            $or: [
                { senderId:myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in in  get messages " + error.message)
        res.status(500).json({ message: "Error fetching messages" });
    }
}

export const sendMessage = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:receiverId}= req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
            
        }
        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageUrl
        })
        await newMessage.save()
        //todo realtime message handler  qitrh socket websocketr
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sending message " + error.message)
        res.status(500).json({ message: "Error sending message" });
    }
}