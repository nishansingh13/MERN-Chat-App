/**
 * Custom hook for managing message operations
 */

import { useState, useCallback } from 'react';
import axios from 'axios';
import { ChatState } from '@/Context/ChatProvider';
import { uploadToCloudinary } from '@/utils/fileUtils';

export function useMessages() {
  const [loading, setLoading] = useState(false);
  const [plusloading, setPlusLoading] = useState(false);
  const { selectedChat, user, setMessages, messages } = ChatState();

  /**
   * Fetch messages for the selected chat
   */
  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://chatify-backend-vpg6.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, user, setMessages]);

  /**
   * Send a text or file message
   */
  const sendMessage = useCallback(async (content, socketRef, updateNewestMessage) => {
    if (!content) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "https://chatify-backend-vpg6.onrender.com/api/message",
        {
          content,
          chatId: selectedChat._id,
        },
        config
      );

      setMessages((prevMessages) => [...prevMessages, data]);

      if (socketRef.current) {
        socketRef.current.emit("new message", data);
        updateNewestMessage(data.chat._id, data.content);
      }

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, [selectedChat, user, setMessages]);

  /**
   * Handle file upload and send as message
   */
  const handleFileUpload = useCallback(async (file, socketRef, updateNewestMessage) => {
    if (!file) return;

    setPlusLoading(true);
    try {
      const fileUrl = await uploadToCloudinary(file);
      await sendMessage(fileUrl, socketRef, updateNewestMessage);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setPlusLoading(false);
    }
  }, [sendMessage]);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback(async (messageId) => {
    try {
      const response = await axios.delete("http://localhost:5000/api/message/delete", {
        data: { id: messageId },
      });

      if (response.status === 200) {
        // Remove message from local state
        setMessages((prevMessages) => 
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        console.log("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }, [setMessages]);

  return {
    loading,
    plusloading,
    fetchMessages,
    sendMessage,
    handleFileUpload,
    deleteMessage,
    messages
  };
}
