/**
 * Custom hook for managing typing indicators
 */

import { useState, useRef, useCallback } from 'react';

export function useTyping() {
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  /**
   * Handle typing events
   */
  const handleTyping = useCallback((value, socketRef, selectedChat, socketConnected) => {
    if (!socketConnected || !socketRef.current) return;

    if (!typing) {
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  }, [typing]);

  /**
   * Stop typing when message is sent
   */
  const stopTyping = useCallback((socketRef, selectedChat) => {
    if (socketRef.current) {
      socketRef.current.emit("stop typing", selectedChat._id);
    }
    setTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  /**
   * Set typing indicator from socket events
   */
  const setTypingIndicator = useCallback((isTypingValue) => {
    setIsTyping(isTypingValue);
  }, []);

  /**
   * Cleanup typing timeout
   */
  const cleanupTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  return {
    typing,
    isTyping,
    handleTyping,
    stopTyping,
    setTypingIndicator,
    cleanupTyping
  };
}
