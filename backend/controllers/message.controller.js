// Import required utilities and models
import { getReceiverSocketId, io } from "../lib/socket.js"; // For socket-based communication
import Message from "../models/message.model.js"; // Message schema/model
import User from "../models/user.model.js"; // User schema/model (ensure .js extension is correct)

// Controller function to get users for the sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
// Retrieve the logged-in user's ID
const loggedInUser = req.user._id;

// Find all users except the logged-in user, excluding their passwords
const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
"-password" // Exclude the password field for security
);

// Send the filtered list of users as a response
res.status(200).json(filteredUsers);
} catch (error) {
// Log the error and return a 500 status with an error message
console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Controller function to get messages between two users
export const getMessages = async (req, res) => {
    try {
        // Extract the ID of the user to chat with from the URL parameters
        const { id: userToChatId } = req.params;

        // Get the logged-in user's ID
        const myId = req.user._id;

        // Fetch messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [ // Either condition can be true
                { senderId: myId, receiverId: userToChatId }, // Sent by me to the other user
                { senderId: userToChatId, receiverId: myId }  // Sent by the other user to me
            ]
        });

        // Send the messages as a response
        res.status(200).json(messages);
    } catch (error) {
        // Log the error and return a 500 status with an error message
        console.log("Error in getMessages controller: " + error.message);
        res.status(500).json({ message: "Error fetching messages" });
    }
};

// Controller function to send a message
export const sendMessage = async (req, res) => {
    try {
    // Destructure the text and image from the request body
    const { text, image } = req.body;

    // Extract the receiver's ID from the URL parameters
    const { id: receiverId } = req.params;

    // Get the sender's ID from the logged-in user's details
    const senderId = req.user._id;

    // Debugging logs to verify sender and receiver IDs
    console.log("this is here");
    console.log(receiverId);
    console.log(senderId);

    // Create a new message instance with sender, receiver, text, and optional image
    const newMessage = new Message({
        senderId, // ID of the sender
        receiverId, // ID of the receiver
        text, // Text content of the message
        image // Optional image associated with the message
    });

    // Save the new message to the database
    await newMessage.save();

    // Get the receiver's socket ID for real-time messaging
    const receiverSocketId = getReceiverSocketId(receiverId);

    // If the receiver is connected via socket, emit the new message
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage); // Real-time message delivery
    }

    // Respond with the created message
        res.status(201).json(newMessage);
    } catch (error) {
        // Log the error and return a 500 status with an error message
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
