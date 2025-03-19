// Import necessary libraries and components
import React, { useEffect } from "react"; // React library with useEffect hook
import Navbar from "./components/Navbar"; // Navbar component
import { Routes, Route, Navigate } from "react-router-dom"; // React Router for navigation
import LoginPage from "./pages/LoginPage"; // Login page component
import SignupPage from "./pages/SignupPage"; // Signup page component
import ProfilePage from "./pages/ProfilePage"; // Profile page component
import SettingsPage from "./pages/SettingsPage"; // Settings page component
import HomePage from "./pages/HomePage"; // Home page component
import { useAuthStore } from "./store/useAuthStore"; // Authentication state store (custom hook)
import { Loader } from "lucide-react"; // Loader component for a loading spinner
import { Toaster } from "react-hot-toast"; // For displaying toast notifications
import { useThemeStore } from "./store/useThemeStore"; // Theme state store (custom hook)

// Main App component
const App = () => {
  // Destructure states and functions from the authentication store
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  // Destructure theme state from the theme store
  const { theme } = useThemeStore();

  // Debugging log to track online users
  console.log("onlineusers");
  console.log(onlineUsers);

  // Run checkAuth when the component mounts or checkAuth changes
  useEffect(() => {
    checkAuth(); // Verify authentication status
  }, [checkAuth]);

  // Apply the current theme to the root HTML element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // Set theme attribute
  }, [theme]);

  // Debugging log to track the authenticated user state
  console.log({ authUser });

  // Show a loading spinner if authentication is in progress and the user is not authenticated
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" /> {/* Loader with animation */}
      </div>
    );
  }

  // Render the app's main content
  return (
    <div data-theme={theme}> {/* Wrapper div with current theme */}
      <Navbar /> {/* Navbar displayed on all pages */}
      <Routes> {/* Define routes for navigation */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />} // Redirect to login if not authenticated
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />} // Redirect to home if authenticated
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} // Redirect to home if authenticated
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} // Redirect to login if not authenticated
        />
        <Route path="/settings" element={<SettingsPage />} /> {/* Always accessible */}
      </Routes>
      <Toaster /> {/* Display toast notifications */}
    </div>
  );
};

// Export the App component as default
export default App;
