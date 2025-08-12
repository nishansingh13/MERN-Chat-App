
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import PropTypes from "prop-types";
import { ChatState } from "@/Context/ChatProvider";
import { useSocket } from "@/Context/SocketProvider";
import { useMessages } from "@/hooks/useMessages";
import { WelcomeScreen } from "./chat/WelcomeScreen";
import { LoadingScreen } from "./chat/LoadingScreen";
import { ChatHeader } from "./chat/ChatHeader";
import { MessagesList } from "./messages/MessagesList";
import { MessageInput } from "./chat/MessageInput";

function ChatSection({ showchat, setshowchat }) {
  const { selectedChat, user, notification, setNotification, setnewestmessage, darkTheme, setMessages } = ChatState();
  const socketRef = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width:768px)" });

  const { 
    loading, 
    plusloading, 
    fetchMessages, 
    sendMessage, 
    handleFileUpload, 
    deleteMessage,
    messages 
  } = useMessages();


  const updateNewestMessage = (chatId, message) => {
    setnewestmessage((prevState) => ({
      ...prevState,
      [chatId]: message,
    }));
  };

  const handleSendMessage = async (content) => {
    // Stop typing when sending message
    if (socketRef.current) {
      socketRef.current.emit("stop typing", selectedChat._id);
    }
    setTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      await sendMessage(content, socketRef, updateNewestMessage);
    } catch (error) {
      alert("Error sending message");
    }
  };


  const handleFileUploadWrapper = async (file) => {
    try {
      await handleFileUpload(file, socketRef, updateNewestMessage);
    } catch (error) {
      alert("Error uploading file");
    }
  };


  const handleTypingWrapper = (value) => {
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
  };

  useEffect(() => {
    if (user && socketRef.current) {
      const socket = socketRef.current;
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => {
        console.log("Someone is typing...");
        setIsTyping(true);
      });
      socket.on("stop typing", () => {
        console.log("Stopped typing...");
        setIsTyping(false);
      });

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        socket.off("connected");
        socket.off("typing");
        socket.off("stop typing");
      };
    }
  }, [user, socketRef]);


  useEffect(() => {
    if (socketRef.current) {
      const socket = socketRef.current;
      
      socket.on("message received", (newMessage) => {
        if (selectedChat && selectedChat._id === newMessage.chat._id) {
          // Add new message to current chat
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          socket.emit("message is read", { messageId: newMessage, chatId: selectedChat._id });
        } else {
          // Add to notifications for other chats
          const senderName = newMessage.sender?.name;
          if (senderName && !notification.includes(senderName)) {
            setNotification((prevNotifications) => [...prevNotifications, senderName]);
          }
        }
      });
      
      socket.on("message read", (updatedMessage) => {
        // Update read status in messages
        setMessages((prevMessages) => {
          return prevMessages.map((message) =>
            message._id === updatedMessage._id
              ? { ...message, read: true }
              : message
          );
        });
        console.log("Message marked as read:", updatedMessage._id);
      });

      return () => {
        socket.off("message received");
        socket.off("message read");
      };
    }
  }, [selectedChat, notification, setNotification, setMessages, socketRef]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (selectedChat && user) {
      fetchMessages();
      // Join the chat room for real-time updates
      if (socketRef.current) {
        socketRef.current.emit("join chat", selectedChat._id);
      }
    }
  }, [selectedChat, user, fetchMessages, socketRef]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  }, [messages]);

  // Debug log for typing indicator
  useEffect(() => {
    console.log("isTyping changed:", isTyping);
  }, [isTyping]);

  return (
    <div className={`${
      isMobile ? 'fixed inset-0 z-40' : 'fixed left-96 right-0 top-0 bottom-0'
    } ${
      darkTheme 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    } flex flex-col overflow-hidden`}>

      {!selectedChat ? (
        <WelcomeScreen darkTheme={darkTheme} isMobile={isMobile} />
      ) : loading ? (
        <LoadingScreen darkTheme={darkTheme} />
      ) : (
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            selectedChat={selectedChat}
            currentUser={user}
            darkTheme={darkTheme}
            isMobile={isMobile}
            showchat={showchat}
            setshowchat={setshowchat}
          />
          
          <MessagesList 
            messages={messages}
            currentUser={user}
            selectedChat={selectedChat}
            darkTheme={darkTheme}
            isTyping={isTyping}
            onDeleteMessage={deleteMessage}
            scrollRef={scrollRef}
          />
          
          <MessageInput 
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUploadWrapper}
            onTyping={handleTypingWrapper}
            plusloading={plusloading}
            darkTheme={darkTheme}
          />
        </div>
      )}
    </div>
  );
}

ChatSection.propTypes = {
  showchat: PropTypes.bool.isRequired,
  setshowchat: PropTypes.func.isRequired,
};

export default ChatSection;
