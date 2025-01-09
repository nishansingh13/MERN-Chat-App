import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
const ChatContext = createContext();
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const[newestmessage,setnewestmessage] = useState({});
  // const socketRef = useRef(null);

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
        messages,
        setMessages,
        setChats,
        newestmessage,
       
        setnewestmessage
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