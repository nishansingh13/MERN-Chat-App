/**
 * Utility functions for chat-related operations
 */

/**
 * Get the appropriate chat name or user object for display
 * @param {Object} selectedChat - The selected chat object
 * @param {Object} currentUser - Current logged-in user
 * @returns {string|Object} Chat name or user object
 */
export function getChatDisplayInfo(selectedChat, currentUser) {
  if (!selectedChat) return null;
  
  if (selectedChat.isGroupChat) {
    return selectedChat.chatName;
  }
  
  // For 1-on-1 chats, return the other user
  return selectedChat.users[0]._id === currentUser._id
    ? selectedChat.users[1]
    : selectedChat.users[0];
}

/**
 * Check if avatar should be shown for group chat message
 * @param {Object} selectedChat - Current chat
 * @param {Object} message - Current message
 * @param {Object} nextMessage - Next message in the list
 * @param {Object} currentUser - Current user
 * @param {number} index - Message index
 * @param {Array} messages - All messages
 * @returns {boolean} True if avatar should be shown
 */
export function shouldShowAvatar(selectedChat, message, currentUser, index, messages) {
  const isOwn = message.sender._id === currentUser._id;
  const isLastMessage = index === messages.length - 1;
  const nextMessageDifferentSender = !isLastMessage && 
    messages[index + 1]?.sender._id !== message.sender._id;
  
  return selectedChat.isGroupChat && 
    !isOwn && 
    (isLastMessage || nextMessageDifferentSender);
}

/**
 * Get message bubble styles based on ownership and theme
 * @param {boolean} isOwn - Whether message is from current user
 * @param {boolean} darkTheme - Current theme
 * @returns {Object} Style classes
 */
export function getMessageBubbleStyles(isOwn, darkTheme) {
  const baseStyles = "group max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm relative";
  
  if (isOwn) {
    const ownStyles = darkTheme 
      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white"
      : "bg-gradient-to-r from-emerald-600 to-green-600 text-white";
    return `${baseStyles} ${ownStyles}`;
  } else {
    const otherStyles = darkTheme 
      ? "bg-gray-700 text-white"
      : "bg-white text-gray-900 border border-gray-200";
    return `${baseStyles} ${otherStyles}`;
  }
}

/**
 * Get border radius style for message bubble
 * @param {boolean} isOwn - Whether message is from current user
 * @returns {Object} Inline style object
 */
export function getMessageBorderRadius(isOwn) {
  return {
    borderRadius: isOwn 
      ? "20px 20px 4px 20px" 
      : "20px 20px 20px 4px"
  };
}
