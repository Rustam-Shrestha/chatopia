import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket: null,

  // Check authentication
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      await get().connectSocket(); // Connect socket after auth success
    } catch (error) {
      set({ authUser: null });
      console.error("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup function
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully!");
      set({ authUser: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Signup failed!";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Logout function
  logout: async () => {
    try {
      console.log("Logout clicked");
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
      await get().disconnectSocket(); // Disconnect socket after logout
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error("An error occurred while logging out.");
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingin: true });
    try {
      const response = await axiosInstance.post("/auth/signin", data);
      toast.success("Login successful");
      set({ authUser: response.data });
      await get().connectSocket(); // Connect socket after login
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Login failed!";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingin: false });
    }
  },

  // Update profile function
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      toast.success("Profile updated successfully!");
      set({ authUser: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Profile update failed!";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Function to connect to a socket server
connectSocket: async () => {
  const { authUser } = get(); // Retrieve the currently authenticated user from the state
  const existingSocket = get().socket; // Retrieve the current socket instance from the state

  // Check if the user is authenticated and if a socket connection already exists
  if (!authUser || (existingSocket && existingSocket.connected)) {
    console.log("Socket is already connected or user is not authenticated");
    return; // Exit the function if conditions are met
  }

  // Initialize a new socket connection with user details
  const socket = io(BASE_URL, { // `BASE_URL` is the server's URL
    query:{
      userId:authUser._id // Pass the authenticated user's ID to the server
    }
  });
  socket.connect(); // Establish the socket connection

  // Save the newly created socket instance in the state
  set({ socket: socket });

  // Set up event listener for successful connection
  socket.on("connect", () => {
    console.log("Socket connected", socket.id); // Log the socket ID upon successful connection
  });

  // Handle the reception of online user IDs from the server
  socket.on("getOnlineUsers", (usersIds) => {
    set({ onlineUsers: usersIds }); // Update the list of online users in the state
  });

  // Set up event listener for connection errors
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err); // Log the error details
  });
},

// Function to disconnect from the socket server
disconnectSocket: async () => {
  const existingSocket = get().socket; // Retrieve the current socket instance from the state

  // Check if there's an active socket connection to disconnect
  if (existingSocket) {
    existingSocket.disconnect(); // Disconnect the socket from the server
    set({ socket: null }); // Clear the socket instance from the state
    console.log("Socket disconnected");
  } else {
    console.log("No socket to disconnect"); // Inform if no socket connection exists
  }
},

}));
