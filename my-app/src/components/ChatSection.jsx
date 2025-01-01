import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars-2";
import { io } from "socket.io-client";
import { Separator  } from "./ui/separator";
import { ChatState } from "@/Context/ChatProvider";
import EmojiPicker from "emoji-picker-react";
import { Smile ,ArrowLeftIcon, Loader2} from "lucide-react";
import Lottie from "lottie-react";
import typinganimation from "../assets/typing_animation.json";
import { Settings } from "lucide-react";
import { SendHorizonal } from "lucide-react";
import { useMediaQuery } from "react-responsive";
var selectedChatcompare;
function ChatSection({ showchat, setshowchat, leftbar, showleftbar }) {
  const endpoint = "https://mern-chat-app-5-lyff.onrender.com/";
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { selectedChat, user, notification, setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({query:"(max-width:768px)"});  
  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://mern-chat-app-5-lyff.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      if (socketRef.current) {
        socketRef.current.emit("join chat", selectedChat._id);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (selectedChat && user) {
      fetchMessages();
      selectedChatcompare = selectedChat;
    }
  }, [selectedChat, user]);

  const getChatName = () => {
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName;
    }
    return selectedChat.users[0]._id === user._id
      ? selectedChat.users[1]
      : selectedChat.users[0];
  };

  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (newMessage) {
      socketRef.current.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "https://mern-chat-app-5-lyff.onrender.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setNewMessage(""); // Clear input after sending the message
        setMessages((prevMessages) => [...prevMessages, data]); // Update message list

        if (socketRef.current) {
          socketRef.current.emit("new message", data); // Emit the new message to other users
        }
      } catch (err) {
        alert("Error sending message");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

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
    if (user && !socketRef.current) {
      socketRef.current = io(endpoint);
      socketRef.current.emit("setup", user);
      socketRef.current.on("connected", () => setSocketConnected(true));
      socketRef.current.on("typing", () => setIsTyping(true));
      socketRef.current.on("stop typing", () => setIsTyping(false));
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message received", (newMessage) => {
        if (selectedChat && selectedChat._id === newMessage.chat._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          const senderName = newMessage.sender?.name;
          if (senderName && !notification.includes(senderName)) {
            setNotification((prevNotifications) => [...prevNotifications, senderName]);
          }
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message received");
      }
    };
  }, [selectedChat, notification, setNotification]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  }, [messages]);

  return (
    <div
      className={` top-[0rem] h-[100%] md:ml-[25rem] bg-[#F5F6FA] overflow-hidden`}
      
    >
    {
  !selectedChat ? (
    <div className="text-black flex items-center justify-center text-[2rem] overflow-hidden">
      YOHOHO CHATS PE CLICK KROOO!!
    </div>
  ) : (
    loading ? (
      
      <div className="flex justify-center items-center h-full">
        <div><Loader2 className="animate-spin text-green-600" size={80}/></div>
      </div>
    ) : (
      // The rest of your chat content here
      <div className={`overflow-hidden `}>
        <div className={`${isDesktop ? "pt-[1.5rem] pb-4 px-3 mt-2 mr-1 rounded-xl bg-gray-200" : "pt-3 px-3 mr-1"}`}>
          <div className="relative flex items-center justify-between ">
            <div className="flex">
              {isMobile && (
                <ArrowLeftIcon
                  className="relative top-3"
                  onClick={() => setshowchat(!showchat)}
                />
              )}
              <img
                src={`${!selectedChat.isGroupChat ? getChatName().pic : ""}`}
                className="w-[3rem] rounded-full p-1"
              />
              <div className="text-[1.5rem] px-2 relative top-1">
                {!selectedChat.isGroupChat ? getChatName().name : getChatName()}
              </div>
            </div>
            <div>
              <Settings onClick={() => showleftbar(!leftbar)} />
            </div>
          </div>
        </div>

        <Separator className={`${isMobile ? "relative top-4" : ""}`} />

        <div className={`w-full ${isMobile ? "mt-0 h-[540px]" : "mt-[2rem] h-[540px]"}`}>
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            className="mt-[1rem]"
            ref={scrollRef}
          >
            <div className="p-4">
              {messages.map((u) => (
                <div
                  key={u._id}
                  className={`${
                    u.sender._id === user._id
                      ? "bg-green-100 my-2 ml-auto text-left"
                      : "bg-blue-300 my-2 mr-auto text-left"
                  } w-fit max-w-[35%] break-words p-2 rounded-md`}
                  style={{
                    borderRadius:
                      u.sender._id === user._id
                        ? "10px 10px 0 10px"
                        : "10px 10px 10px 0",
                  }}
                >
                  {u.content}
                </div>
              ))}
            </div>
            <div className="w-[4rem] h-[2rem]">
              {!isTyping && (
                <Lottie
                  animationData={typinganimation}
                  loop={true}
                  autoplay={true}
                  className={`w-[5rem] h-[4rem] relative ${isMobile ? "bottom-[2rem]" : "bottom-[2rem]"} left-1`}
                />
              )}
            </div>
          </Scrollbars>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-[80px] left-1/2 transform -translate-x-1/2">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setNewMessage(newMessage + emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}

        <div
          className={`border border-gray-300 my-1 bg-gray-200 h-lvh ${isDesktop ? "mx-4 rounded-full h-[3.9rem] outl" : ""}`}
        >
          <form onSubmit={sendMessage} className="flex gap-5 ">
            <button
              type="button"
              className="bottom-[120px] left-[50%] transform -translate-x-1/2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className={`relative ${isMobile ? "left-5 top-1" : "left-[1.6rem] top-2"}`} />
            </button>
            <Input
              className={`md:w-[60rem] rounded-3xl ${isDesktop ? "mt-3 bg-gray-200" : "mt-1 bg-white"} flex-1 placeholder:text-black`}
              placeholder="Type your message here..."
              onChange={typingHandler}
              value={newMessage}
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
            />
            <button type="submit">
              <SendHorizonal
                className={`border bg-green-600 p-2 rounded-full relative ${isMobile ? "top-1" : "top-2"} text-white right-2 mt-[-0.3rem]`}
                size={isMobile ? 35 : 40}
              />
            </button>
          </form>
        </div>
      </div>
    )
  )
}

    </div>
  );
}

export default ChatSection;
