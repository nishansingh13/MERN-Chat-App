import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars-2";
import { io } from "socket.io-client";
import image from "../assets/background.jpg";
import { Separator } from "./ui/separator";
import { ChatState } from "@/Context/ChatProvider";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import Lottie from "lottie-react";
import typinganimation from "../assets/typing_animation.json";
import { Settings } from "lucide-react";
import { SendHorizonal } from "lucide-react";
import { useMediaQuery } from "react-responsive";

var selectedChatcompare;

function ChatSection({ showchat, setshowchat, leftbar, showleftbar }) {
  const endpoint = "http://192.168.1.9:5000/";
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
        `http://192.168.1.9:5000/api/message/${selectedChat._id}`,
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
          "http://192.168.1.9:5000/api/message",
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
      className={`${leftbar ? " ml-[0rem]" : "ml-[5rem]"} top-[0rem] h-[100%] md:ml-[25rem] overflow-hidden`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {!selectedChat ? (
        <div className="text-black flex items-center justify-center text-[2rem] overflow-hidden">
          YOHOHO CHATS PE CLICK KROOO!!
        </div>
      ) : (
        <div className={`overflow-hidden`}>
          <div className="relative pt-[1.5rem] pb-4 px-3">
            <div className="absolute inset-0 bg-[transparent] backdrop-blur-sm z-0 " />
            <div className="relative flex items-center justify-between">
              <div className="flex">
                <img
                  src={`${!selectedChat.isGroupChat ? getChatName().pic : ""}`}
                  className="w-[3rem] rounded-full p-1"
                />
                <div className="text-[1.5rem] px-2 relative top-1">
                  {!selectedChat.isGroupChat ? getChatName().name : getChatName()}
                </div>
              </div>
              <div><Settings onClick={() => showleftbar(!leftbar)} /></div>
            </div>
          </div>

          <Separator />
          <div className="h-[440px] w-full mt-[2rem]">
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              className="mt-[2rem]"
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
            </Scrollbars>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-[80px] left-1/2 transform -translate-x-1/2">
              <EmojiPicker onEmojiClick={(emoji) => {
                setNewMessage(newMessage + emoji.emoji);
                setShowEmojiPicker(false);
              }} />
            </div>
          )}

          {isTyping && (
            <Lottie
              animationData={typinganimation}
              loop={true}
              autoplay={true}
              className="w-[5rem] h-[5rem] relative bottom-[1rem] left-1"
            />
          )}

          <div className="border border-gray-300 my-1"></div>
          <div className="flex md:w-[100%] top-[90%] bg-[#F8F8F8] justify-between py-5 mt-[rem]">
            <div className="flex gap-5">
              <button
                type="button"
                className="bottom-[120px] left-[50%] transform -translate-x-1/2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="relative left-5" />
              </button>

              <form onSubmit={sendMessage} className="flex gap-2 w-full">
                <Input
                  className="md:w-[60rem] placeholder:text-black border-black w-[14rem] bg-white border-none"
                  placeholder="Type your message here..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <button
                  type="submit"
                  className="relative   md:right-[-1rem] top-[-0.1rem] cursor-pointer border bg-green-300 rounded-sm w-[2.5rem] h-[2.5rem] p-1"
                >
                  <SendHorizonal />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatSection;
