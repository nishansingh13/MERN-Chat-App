import React, { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
const ChatContext = createContext();
import { useToast } from "@/hooks/use-toast";
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      if (userInfo) {
        setUser(userInfo);  
      } else {
        navigate("/"); 
      }
    }, [navigate, toast]);
  
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;