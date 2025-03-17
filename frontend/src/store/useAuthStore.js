import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      set({ authUser: null });
      console.error("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

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
  logout: async () => {
    try {
      console.log("clicked logotu")
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error("An error occurred while logging out.");
    }
  },
  login: async (data) => {
    set({ isLoggingin: true });
    try {
      const response = await axiosInstance.post("/auth/signin", data);
      toast.success("Login successful");
      set({ authUser: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Login failed!";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingin: false });
    }

  },
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
  }

}));
