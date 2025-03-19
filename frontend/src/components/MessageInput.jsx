// Import necessary libraries and components
import { useRef, useState } from "react"; // React hooks for managing state and references
import { useChatStore } from "../store/useChatStore"; // Zustand store for chat-related state
import { Image, Send, X } from "lucide-react"; // Icons for UI elements
import toast from "react-hot-toast"; // Library for displaying notifications

// Functional component for the message input area
const MessageInput = () => {
  // State variables for managing the input text and image preview
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // Reference to the file input element
  const { sendMessage } = useChatStore(); // Extract the sendMessage function from the chat store

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file.type.startsWith("image/")) { // Validate the file type
      toast.error("Please select an image file"); // Show an error notification
      return;
    }

    const reader = new FileReader(); // Create a FileReader to read the file
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the image preview to the result of the file read
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  };

  // Remove the selected image
  const removeImage = () => {
    setImagePreview(null); // Clear the image preview
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input value
  };

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!text.trim() && !imagePreview) return; // Ensure there is content to send

    try {
      await sendMessage({
        text: text.trim(), // Trim whitespace from the text
        image: imagePreview, // Include the image preview in the message
      });

      // Clear the form inputs after sending the message
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error); // Log the error for debugging
    }
  };

  return (
    <div className="p-4 w-full"> {/* Container with padding and full width */}
      {imagePreview && ( // Conditionally render the image preview
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview} // Display the image preview
              alt="Preview" // Alt text for accessibility
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700" // Styling for the image
            />
            <button
              onClick={removeImage} // Remove the image when the button is clicked
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" /> {/* Close icon for removing the image */}
            </button>
          </div>
        </div>
      )}

      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text" // Input for typing the message
            className="w-full input input-bordered rounded-lg input-sm sm:input-md" // Styling for the input
            placeholder="Type a message..." // Placeholder text for the input
            value={text} // Bind the input value to the state
            onChange={(e) => setText(e.target.value)} // Update the state on change
          />
          <input
            type="file" // Hidden file input for selecting an image
            accept="image/*" // Restrict file type to images only
            className="hidden"
            ref={fileInputRef} // Bind the input to the reference
            onChange={handleImageChange} // Handle image selection
          />

          <button
            type="button" // Button to open the file selector
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} // Styling based on image preview status
            onClick={() => fileInputRef.current?.click()} // Trigger the file input click
          >
            <Image size={20} /> {/* Image icon */}
          </button>
        </div>
        <button
          type="submit" // Submit button for sending messages
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Disable if there is no input
        >
          <Send size={22} /> {/* Send icon */}
        </button>
      </form>
    </div>
  );
};

export default MessageInput; // Export the MessageInput component
