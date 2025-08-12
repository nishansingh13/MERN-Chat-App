import { useState } from "react";
import { Smile, Plus, SendHorizonal, Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";

export function MessageInput({ 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onFileUpload, 
  onTyping, 
  plusloading, 
  darkTheme 
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    onTyping(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setNewMessage(newMessage + emoji.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}

      {/* Message Input Form */}
      <div className={`${
        darkTheme 
          ? "bg-gray-800/90 border-gray-700" 
          : "bg-white/90 border-gray-200"
      } backdrop-blur-sm border-t shadow-lg px-4 sm:px-6 py-4`}>
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full ${
              darkTheme 
                ? "hover:bg-gray-700 text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            } transition-colors duration-200`}
          >
            <Smile size={20} />
          </button>

          {/* File Upload Button */}
          {!plusloading ? (
            <label htmlFor="file-put" className={`p-2 rounded-full cursor-pointer ${
              darkTheme 
                ? "hover:bg-gray-700 text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            } transition-colors duration-200`}>
              <Plus size={20} />
              <input 
                type="file" 
                className="hidden" 
                id="file-put" 
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="p-2">
              <Loader2 className={`animate-spin ${
                darkTheme ? "text-orange-500" : "text-emerald-600"
              }`} size={20} />
            </div>
          )}

          {/* Message Input */}
          <Input
            className={`flex-1 rounded-2xl border-none ${
              darkTheme 
                ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500/20" 
                : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-emerald-500/20"
            } px-4 py-3 focus:ring-2 transition-all duration-200`}
            placeholder="Type your message here..."
            onChange={handleInputChange}
            value={newMessage}
          />

          {/* Send Button */}
          <button 
            type="submit"
            className={`p-3 rounded-full ${
              darkTheme 
                ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700" 
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            } text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
          >
            <SendHorizonal size={20} />
          </button>
        </form>
      </div>
    </>
  );
}

MessageInput.propTypes = {
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onTyping: PropTypes.func.isRequired,
  plusloading: PropTypes.bool.isRequired,
  darkTheme: PropTypes.bool.isRequired,
};
