// Importing necessary React hooks and components
import { useEffect, useState } from "react";

// Importing functions and states from custom stores for managing chat and authentication
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

// Importing a skeleton component for loading state
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

// Importing an icon component for rendering user icons
import { Users } from "lucide-react";

// Defining the Sidebar functional component
const Sidebar = () => {
  // Destructuring required state and functions from `useChatStore`
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  // Destructuring online user data from `useAuthStore`
  const { onlineUsers } = useAuthStore();

  // Local state to toggle "show online users only"
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // useEffect hook to call `getUsers` function when the component mounts or `getUsers` changes
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filtered users based on whether the "show online only" toggle is active
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id)) // Only show users who are online
    : users; // Show all users when toggle is inactive

  // If users are still loading, render the `SidebarSkeleton` loading component
  if (isUsersLoading) return <SidebarSkeleton />;

  // Main component rendering starts here
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header section with title and optional toggle */}
      <div className="border-b border-base-300 w-full p-5">
        {/* Sidebar title */}
        <div className="flex items-center gap-2">
          <Users className="size-6" /> {/* Icon for Contacts */}
          <span className="font-medium hidden lg:block">Contacts</span> {/* Title visible on large screens */}
        </div>

        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          {/* Checkbox for toggling "show online only" */}
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly} // Checkbox state bound to `showOnlineOnly`
              onChange={(e) => setShowOnlineOnly(e.target.checked)} // Update state when checkbox toggles
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span> {/* Label for checkbox */}
          </label>
          {/* Placeholder to show the count of online users */}
          {/* <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> */}
        </div>
      </div>

      {/* User list rendering */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id} // Unique identifier for each user
            onClick={() => setSelectedUser(user)} // Set the clicked user as selected
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            {/* User profile picture and online status */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"} // Default avatar if profile picture is unavailable
                alt={user.name} // Accessible alt text for user image
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User information, visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div> {/* Full name */}
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"} {/* Online/offline status */}
              </div>
            </div>
          </button>
        ))}

        {/* Placeholder for no users available */}
        {/* {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )} */}
      </div>
    </aside>
  );
};

// Exporting the Sidebar component as default for usage elsewhere
export default Sidebar;
