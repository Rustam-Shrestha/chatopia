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
}));
