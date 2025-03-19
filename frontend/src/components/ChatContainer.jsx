// Import necessary hooks, stores, components, and utilities
import { useChatStore } from "../store/useChatStore"; // Zustand store for managing chat state
import { useEffect, useRef } from "react"; // React hooks for side effects and element references
import ChatHeader from "./ChatHeader"; // Component for the chat header
import MessageInput from "./MessageInput"; // Component for sending messages
import MessageSkeleton from "./skeletons/MessageSkeleton"; // Placeholder skeleton for loading messages
import { useAuthStore } from "../store/useAuthStore"; // Store for authentication state
import { formatMessageTime } from "../lib/utils"; // Utility function to format message timestamps

// ChatContainer component handles the chat interface
const ChatContainer = () => {
// Extract necessary state and actions from stores
const {
messages, // List of chat messages
getMessages, // Function to fetch messages for the selected user
isMessagesLoading, // State to check if messages are being loaded
selectedUser, // The currently selected user for chat
subscribeToMessages, // Function to start listening to real-time messages
unsubscribeFromMessages, // Function to stop listening to real-time messages
} = useChatStore();
const { authUser } = useAuthStore(); // Retrieve authenticated user info
const messageEndRef = useRef(null); // Reference to the last message for auto-scrolling

// Fetch messages and set up real-time subscriptions when a user is selected
useEffect(() => {
getMessages(selectedUser._id); // Fetch messages for the selected user
subscribeToMessages(); // Subscribe to real-time message updates

// Cleanup: Unsubscribe from messages when the component unmounts
return () => unsubscribeFromMessages();
}, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

// Auto-scroll to the latest message whenever messages are updated
useEffect(() => {
if (messageEndRef.current && messages) {
messageEndRef.current.scrollIntoView({ behavior: "smooth" });
}
}, [messages]);

// Render loading skeleton while messages are being fetched
if (isMessagesLoading) {
return (
<div className="flex-1 flex flex-col overflow-auto">
  <ChatHeader /> {/* Display the chat header */}
  <MessageSkeleton /> {/* Display loading skeleton for messages */}
  <MessageInput /> {/* Keep the input visible */}
</div>
);
}

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader /> {/* Display the chat header */}
      
      {/* Messages display area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Map over messages to display each one */}
        {messages.map((message) => (
          <div
            key={message._id} // Unique key for each message
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} // Align messages based on sender
            ref={messageEndRef} // Reference for auto-scrolling
          >
            {/* User avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png" // Use authenticated user's profile picture
                      : selectedUser.profilePic || "/avatar.png" // Use selected user's profile picture
                  }
                  alt="profile pic" // Alt text for image
                />
              </div>
            </div>
            {/* Chat header with timestamp */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)} {/* Format the message's timestamp */}
              </time>
            </div>
            {/* Chat bubble containing text and optional image */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image} // Display image if present
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>} {/* Display text if present */}
            </div>
          </div>
        ))}
      </div>

      {/* Message input field */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer; // Export the ChatContainer component
