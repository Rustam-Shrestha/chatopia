// Import necessary modules
import { create } from "zustand"; // Zustand library for state management
import toast from "react-hot-toast"; // Library for displaying toast notifications
import { axiosInstance } from "../lib/axios"; // Custom Axios instance for API requests
import { useAuthStore } from "./useAuthStore"; // Authentication store for managing user authentication state

// Zustand store for chat-related state management
export const useChatStore = create((set, get) => ({
    // Initial state variables
messages: [], // Array to store messages
users: [], // Array to store user list
selectedUser: null, // Currently selected user for chat
isUsersLoading: false, // Loading state for fetching users
isMessagesLoading: false, // Loading state for fetching messages

// Function to fetch users
getUsers: async () => {
set({ isUsersLoading: true }); // Set loading state to true
try {
const res = await axiosInstance.get("/message/users"); // Fetch users from API
set({ users: res.data }); // Update state with fetched users
} catch (error) {
// Show an error notification if fetching fails
toast.error(error.response?.data?.message || "Failed to load users.");
} finally {
set({ isUsersLoading: false }); // Set loading state to false after completion
}
    },

    // Function to fetch messages for the selected user
    getMessages: async (userId) => {
        if (!userId) {
            toast.error("User ID is missing."); // Show error if user ID is not provided
            return; // Exit function
        }

        set({ isMessagesLoading: true }); // Set loading state to true
        try {
            const res = await axiosInstance.get(`/message/${userId}`); // Fetch messages from API
            set({ messages: res.data }); // Update state with fetched messages
        } catch (error) {
            // Show an error notification if fetching fails
            toast.error(error.response?.data?.message || "Failed to load messages.");
        } finally {
            set({ isMessagesLoading: false }); // Set loading state to false after completion
        }
    },

    // Function to send a message
    sendMessage: async (messageData) => {
      const { selectedUser } = get(); // Retrieve the currently selected user from state
      const { authUser } = useAuthStore.getState(); // Retrieve the authenticated user from auth store
  
      console.log("Selected User:", selectedUser); // Debugging log for selected user
      console.log("Logged-in User:", authUser); // Debugging log for authenticated user
  
      if (!selectedUser) {
          toast.error("No user selected."); // Notify if no user is selected
          console.error("Error: No user selected."); // Debugging log for error
          return; // Exit function
      }
  
      if (!authUser?._id) {
          toast.error("Sender ID (your user ID) is missing."); // Notify if sender ID is missing
          console.error("Error: Sender ID (user._id) is missing."); // Debugging log for error
          return; // Exit function
      }
  
      try {
          console.log("Message Data:", messageData); // Debugging log for message data
          console.log("Sending message to:", `/message/send/${selectedUser._id}`); // Debugging log for API endpoint
  
          const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, {
              ...messageData, // Include message details
              senderId: authUser._id, // Explicitly set sender ID
          });
  
          console.log("Message sent successfully. Response:", res.data); // Debugging log for success response
  
          // Update state with the newly sent message
          set({ messages: [...get().messages, res.data] });
      } catch (error) {
          console.error("Failed to send message:", error); // Debugging log for error
          toast.error(error.response?.data?.message || "Failed to send message."); // Notify about the error
      }
  },
  

    // Function to subscribe to real-time message updates
    subscribeToMessages: () => {
        const { selectedUser } = get(); // Retrieve the selected user from state
        const { user } = useAuthStore.getState(); // Retrieve the authenticated user

        if (!selectedUser || !user?._id) return; // Exit if conditions are not met

        const socket = useAuthStore.getState().socket; // Retrieve the socket instance from auth store

        // Listen for new messages from the server
        socket.on("newMessage", (newMessage) => {
            // Check if the message belongs to the selected user or the logged-in user
            if (newMessage.senderId === selectedUser._id || newMessage.senderId === user._id) {
                set({ messages: [...get().messages, newMessage] }); // Update state with the new message
            }
        });
    },

    // Function to unsubscribe from real-time message updates
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket; // Retrieve the socket instance from auth store
        socket.off("newMessage"); // Remove the event listener for new messages
    },

    // Function to set the currently selected user
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
