// Import the chat store and necessary components
import { useChatStore } from "../store/useChatStore"; // Zustand store to manage chat-related state
import Sidebar from "../components/Sidebar"; // Sidebar component for displaying user list or navigation
import NoChatSelected from "../components/NoChatSelected"; // Component shown when no chat is selected
import ChatContainer from "../components/ChatContainer"; // Component that renders the chat interface

// Functional component for the Home Page
const HomePage = () => {
  const { selectedUser } = useChatStore(); // Retrieve the currently selected user from the chat store

  return (
    // Full-screen container with a base background
    <div className="h-screen bg-base-200">
      {/* Center the main content with padding at the top */}
      <div className="flex items-center justify-center pt-20 px-4">
        {/* Main container with a shadow and rounded corners */}
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* Flex container for the layout */}
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar /> {/* Sidebar for user list or navigation */}
            
            {/* Show either NoChatSelected or ChatContainer based on whether a user is selected */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the HomePage component as the default export
export default HomePage;
