import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars-2";
import { ChatState } from "@/Context/ChatProvider";
import EmojiPicker from "emoji-picker-react";
import { Smile ,ArrowLeftIcon, Loader2, MessageSquareText, Plus, CheckCheck, PhoneCall, ArrowDown} from "lucide-react";
import Lottie from "lottie-react";
import typinganimation from "../assets/typing_animation.json";
import { SendHorizonal } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import group from "../assets/group.jpg";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/Context/SocketProvider";
import { Avatar } from "./ui/avatar";

let selectedChatcompare;
function ChatSection({ showchat, setshowchat }) {
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [calling,setCalling]=useState(false);
  const { selectedChat, user, notification, setNotification ,setnewestmessage} = ChatState();
  const socketRef = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [open,setOpen]=useState(false);
  const scrollRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [plusloading,setplusloading]=useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isMobile = useMediaQuery({query:"(max-width:768px)"}); 
  const {messages,setMessages,darkTheme} = ChatState();
  const navigate = useNavigate();
  const updateNewestMessage = (chatId, message) => {
    setnewestmessage((prevState) => ({
      ...prevState,
      [chatId]: message, // Set the newest message for the specific chat
    }));
  };
  
  
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
        `https://mern-chat-app-fk6w.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      if (socketRef.current) {
        socketRef.current.emit("join chat", selectedChat._id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  }, [selectedChat, user, socketRef, setMessages]);
  
  useEffect(() => {
    if (selectedChat && user) {
      fetchMessages();
      selectedChatcompare = selectedChat;
    }
  }, [selectedChat, user, fetchMessages]);

  const getChatName = () => {
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName;
    }
    return selectedChat.users[0]._id === user._id
      ? selectedChat.users[1]
      : selectedChat.users[0];
  };
  const generatelink = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "dqsx8yzbs");
    console.log(file.type)
    try {
      setplusloading(true);
      const uploadUrl = file.type.startsWith("video/")
      ? "https://api.cloudinary.com/v1_1/dqsx8yzbs/video/upload"
      : file.type.startsWith("image/")
      ? "https://api.cloudinary.com/v1_1/dqsx8yzbs/image/upload"
      : "https://api.cloudinary.com/v1_1/dqsx8yzbs/raw/upload";
      const res = await axios.post(
        uploadUrl,
        data
      );
      if (res.status === 200) {
        const secureUrl = res.data.secure_url;
        // Option 1: Send the link immediately
        sendMessage(null, secureUrl);
  
        // Option 2: Set the link as the message content
        // setNewMessage(secureUrl);
      }
    } catch (err) {
      console.error("Error uploading file to Cloudinary:", err);
    }
    finally{
      setplusloading(false);
    }
  };
  
  const sendMessage = async (e, fileMessage = null) => {
    if (e) e.preventDefault(); // Prevent the default form submission
    const messageContent = fileMessage || newMessage; // Use the link if provided
    if (messageContent) {
      socketRef.current.emit("stop typing", selectedChat._id);
  
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const { data } = await axios.post(
          "https://mern-chat-app-fk6w.onrender.com/api/message",
          {
            content: messageContent,
            chatId: selectedChat._id,
          },
          config
        );
  
        setNewMessage(""); // Clear input after sending the message
        setMessages((prevMessages) => [...prevMessages, data]); // Update message list
  
        if (socketRef.current) {
          socketRef.current.emit("new message", data);
          updateNewestMessage(data.chat._id, data.content);
        }
      } catch (error) {
        alert("Error sending message");
        console.error(error);
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
  function convertToIST(utcTimestamp) {
    const utcDate = new Date(utcTimestamp); 
    const options = { 
        timeZone: 'Asia/Kolkata', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true // Use 24-hour format
    };
    const istDate = utcDate.toLocaleString('en-IN', options);
    return istDate.replace(',', ''); // Optional: Remove the comma
}
  const handleDecline = ()=>{
    console.log("Clicked on decline");
   
    socketRef.current.emit("call rejected",(user._id));
  }
  const handleUserJoined = useCallback(({id, room}) => {
    console.log(id);
    const userdata = (JSON.parse(localStorage.getItem("userInfo")))
    if (room.users.some(user => user._id === userdata._id)) {
      setOpen(true);
    } 
  }, []);
  const handleRejection = ()=>{
    toast({
      variant:"destructive",
      title:"Call Declined by user",
      description:"Call Declined"
    })
    
    setCalling(false);
    console.log("Call rejected by recipient");
  }
  const handleAcceptance = ()=>{
    if(socketRef.current){
      const email = user.email;
      const id = user._id;
      socketRef.current.emit("call accepted by receiver",{email,id});
      navigate("/call");
    }
  }
  // sirf receiver ka data show krenge sender ki receiver aagya h 
  const handleAcceptSender = useCallback(({ email, id }) => {

    navigate("/call", { state: { email, id } });
  }, [navigate]);
  
  useEffect(() => {
    if (user && socketRef.current) {
      const socket = socketRef.current;
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("user joined", handleUserJoined);
      socket.on("stop typing", () => setIsTyping(false));
      socket.on("call rejected by receiver", handleRejection);
      socket.on("call accepted by receiver", handleAcceptSender);

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        socket.off("connected");
        socket.off("typing");
        socket.off("stop typing");
        socket.off("user joined", handleUserJoined);
        socket.off("call rejected by receiver", handleRejection);
        socket.off("call accepted by receiver", handleAcceptSender);
      };
    }
  }, [user, socketRef, handleUserJoined, handleAcceptSender]);
  
  const handleSubmit = ()=>{
    // console.log(user.email,selectedChat);
    const email = user.email;
    const room = selectedChat;
    socketRef.current.emit("join room", { email,room});
  }
  useEffect(() => {
    if (socketRef.current) {
      const socket = socketRef.current;
      
      socket.on("message received", (newMessage) => {
        if (selectedChat && selectedChat._id === newMessage.chat._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);  
          socket.emit("message is read", {messageId: newMessage, chatId: selectedChat._id});
        } else {
          const senderName = newMessage.sender?.name;
          if (senderName && !notification.includes(senderName)) {
            setNotification((prevNotifications) => [...prevNotifications, senderName]);
          }
        }
      });
      
      socket.on("message read", (updatedMessage) => {
        setMessages((prevMessages) => {
          return prevMessages.map((message) =>
            message._id === updatedMessage._id
              ? { ...message, read: true }
              : message
          );
        });
      });

      return () => {
        socket.off("message received");
        socket.off("message read");
      };
    }
  }, [selectedChat, notification, setNotification, setMessages, socketRef]);
  // In your socket event listener, update the message state to mark as "seen"


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  }, [messages]);
  const deleteMessage = async (id) => {
    try {
        console.log("Deleting message with ID:", id);

        const res = await axios.delete("http://localhost:5000/api/message/delete", {
            data: { id },
        });

        if (res.status === 200) {
            console.log("Message deleted successfully:", res.data);
        }
    } catch (err) {
        console.error("Error while deleting message:", err);
    }
};

 
  return (
    <div className={`${
      isMobile ? 'fixed inset-0 z-40' : 'fixed left-96 right-0 top-0 bottom-0'
    } ${
      darkTheme 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    } flex flex-col overflow-hidden`}>

      {/* Incoming Call Alert */}
      {open && (
        <AlertDialog open={open || calling} onOpenChange={setOpen}>
          <AlertDialogContent className={`${
            darkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-2xl shadow-2xl`}>
            <AlertDialogHeader>
              <AlertDialogTitle className={`${
                darkTheme ? "text-white" : "text-gray-900"
              } text-xl font-bold`}>
                Incoming Call
              </AlertDialogTitle>
              <AlertDialogDescription className={`${
                darkTheme ? "text-gray-300" : "text-gray-600"
              }`}>
                Call from <span className={`font-semibold ${
                  darkTheme ? "text-orange-400" : "text-emerald-600"
                }`}>{user.name} ({user.email})</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel 
                onClick={() => {setOpen(false); handleDecline()}}
                className="bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Decline
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {handleAcceptance()}}
                className={`${
                  darkTheme 
                    ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700" 
                    : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                } text-white border-none`}
              >
                Answer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {!selectedChat ? (
        /* Welcome Screen */
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <div className={`inline-flex items-center gap-4 p-6 rounded-2xl ${
              darkTheme 
                ? "bg-gray-800/50 border border-gray-700" 
                : "bg-white/80 border border-gray-200"
            } backdrop-blur-sm shadow-2xl`}>
              <div className={`p-4 rounded-full ${
                darkTheme 
                  ? "bg-gradient-to-r from-orange-600 to-amber-600" 
                  : "bg-gradient-to-r from-emerald-600 to-green-600"
              }`}>
                <MessageSquareText size={40} className="text-white" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${
                  darkTheme ? "text-white" : "text-gray-800"
                }`}>
                  Chatify {!isMobile ? "Web" : ""}
                </h1>
                <p className={`text-lg ${
                  darkTheme ? "text-orange-400" : "text-emerald-600"
                } font-medium`}>
                  Responsive Chatting Web App
                </p>
              </div>
            </div>
            
            <p className={`text-lg ${
              darkTheme ? "text-gray-400" : "text-gray-600"
            } max-w-md mx-auto leading-relaxed`}>
              Select a conversation from the sidebar to start chatting with your friends and family.
            </p>
          </div>
        </div>
      ) : loading ? (
        /* Loading State */
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center space-y-4">
            <Loader2 className={`animate-spin ${
              darkTheme ? "text-orange-500" : "text-emerald-600"
            } mx-auto`} size={60} />
            <p className={`text-lg font-medium ${
              darkTheme ? "text-gray-400" : "text-gray-600"
            }`}>
              Loading messages...
            </p>
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className={`${
            darkTheme 
              ? "bg-gray-800/90 border-gray-700" 
              : "bg-white/90 border-gray-200"
          } backdrop-blur-sm border-b shadow-lg px-4 sm:px-6 py-4 flex items-center justify-between`}>
            
            <div className="flex items-center gap-4">
              {/* Back Button for Mobile */}
              {isMobile && (
                <button
                  onClick={() => setshowchat(!showchat)}
                  className={`p-2 rounded-full ${
                    darkTheme 
                      ? "hover:bg-gray-700 text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  } transition-colors duration-200`}
                >
                  <ArrowLeftIcon size={20} />
                </button>
              )}

              <Dialog>
                <DialogTrigger>
                  <div className="relative group cursor-pointer">
                    {!selectedChat.isGroupChat ? (
                      <Avatar
                        src={getChatName().pic}
                        name={getChatName().name}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <img
                        src={group}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md group-hover:scale-105 transition-transform duration-200"
                        alt="Group"
                      />
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className={`${
                  darkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } rounded-2xl shadow-2xl`}>
                  <DialogHeader>
                    <DialogTitle className={`${
                      darkTheme ? "text-white" : "text-gray-900"
                    } text-xl font-bold text-center`}>
                      User Profile
                    </DialogTitle>
                    <DialogDescription className="text-center space-y-4">
                      {!selectedChat.isGroupChat ? (
                        <Avatar
                          src={getChatName().pic}
                          name={getChatName().name}
                          alt="Profile"
                          className={`${
                            isMobile ? "w-32 h-32" : "w-40 h-40"
                          } rounded-full mx-auto object-cover border-4 ${
                            darkTheme ? "border-orange-500" : "border-emerald-500"
                          } shadow-2xl`}
                          size={isMobile ? 128 : 160}
                        />
                      ) : (
                        <img
                          src={group}
                          className={`${
                            isMobile ? "w-32 h-32" : "w-40 h-40"
                          } rounded-full mx-auto object-cover border-4 ${
                            darkTheme ? "border-orange-500" : "border-emerald-500"
                          } shadow-2xl`}
                          alt="Group"
                        />
                      )}
                      <div className={`${
                        darkTheme ? "text-gray-300" : "text-gray-700"
                      } space-y-2`}>
                        <p className="text-lg font-semibold">
                          {!selectedChat.isGroupChat ? getChatName().name : getChatName()}
                        </p>
                        {!selectedChat.isGroupChat && (
                          <p className="text-sm">
                            <span className="font-medium">Email: </span>
                            {getChatName()?.email}
                          </p>
                        )}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {/* Chat Name and Status */}
              <div className="flex-1 min-w-0">
                <h2 className={`text-lg font-bold truncate ${
                  darkTheme ? "text-white" : "text-gray-900"
                }`}>
                  {!selectedChat.isGroupChat ? getChatName().name : getChatName()}
                </h2>
                <p className={`text-sm ${
                  darkTheme ? "text-gray-400" : "text-gray-500"
                }`}>
                  {selectedChat.isGroupChat ? `${selectedChat.users.length} members` : ""}
                </p>
              </div>
            </div>

            {/* Call Button */}
            <button
              onClick={() => {
                handleSubmit();
                setCalling(true);
              }}
              className={`p-3 rounded-full ${
                darkTheme 
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700" 
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              } text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
            >
              <PhoneCall size={20} />
            </button>
          </div>
          {/* Calling Overlay */}
          {calling && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className={`${
                darkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              } p-8 rounded-2xl shadow-2xl border text-center space-y-6 max-w-sm mx-4`}>
                <div className="relative">
                  {!selectedChat.isGroupChat ? (
                    <Avatar
                      src={getChatName().pic}
                      name={getChatName().name}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-500 shadow-lg"
                      size={96}
                    />
                  ) : (
                    <img
                      src={group}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-500 shadow-lg"
                      alt="Group"
                    />
                  )}
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping"></div>
                </div>
                
                <div className={`space-y-2 ${darkTheme ? "text-white" : "text-gray-900"}`}>
                  <h3 className="text-xl font-bold">
                    Calling {!selectedChat.isGroupChat ? getChatName().name : getChatName()}...
                  </h3>
                  <p className={`text-sm ${darkTheme ? "text-gray-400" : "text-gray-600"}`}>
                    Connecting to call...
                  </p>
                </div>
                
                <button
                  onClick={() => setCalling(false)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors duration-200 shadow-lg"
                >
                  Cancel Call
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              ref={scrollRef}
              className="h-full"
            >
              <div className="p-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender._id === user._id;
                  const showAvatar = selectedChat.isGroupChat && 
                    !isOwn && 
                    (index === messages.length - 1 || messages[index + 1]?.sender._id !== message.sender._id);

                  return (
                    <div key={message._id} className="space-y-2">
                      {/* Message Bubble */}
                      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {/* Avatar for group chats */}
                        {showAvatar && (
                          <Avatar
                            src={message.sender.pic}
                            name={message.sender.name}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            size={32}
                          />
                        )}
                        
                        <div className={`
                          group max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl
                          ${isOwn 
                            ? `${
                                darkTheme 
                                  ? "bg-gradient-to-r from-orange-600 to-amber-600" 
                                  : "bg-gradient-to-r from-emerald-600 to-green-600"
                              } text-white` 
                            : `${
                                darkTheme 
                                  ? "bg-gray-700 text-white" 
                                  : "bg-white text-gray-900 border border-gray-200"
                              }`
                          }
                          rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm relative
                        `}
                        style={{
                          borderRadius: isOwn 
                            ? "20px 20px 4px 20px" 
                            : "20px 20px 20px 4px"
                        }}
                        >
                          {/* Delete Button for Own Messages */}
                          {isOwn && (
                            <button
                              onClick={() => deleteMessage(message._id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 z-10"
                              title="Delete message"
                            >
                              <ArrowDown size={12} />
                            </button>
                          )}

                          {/* Group Chat Sender Name */}
                          {selectedChat.isGroupChat && !isOwn && (
                            <p className={`text-xs font-medium mb-1 ${
                              darkTheme ? "text-orange-300" : "text-emerald-600"
                            }`}>
                              {message.sender.name}
                            </p>
                          )}

                          {/* Message Content */}
                          <div className="space-y-2">
                            {message.content.includes("dqsx8yzbs/image/") ? (
                              <Dialog>
                                <DialogTrigger>
                                  <img 
                                    src={message.content} 
                                    alt="Shared image" 
                                    className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200" 
                                  />
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <img 
                                    src={message.content} 
                                    alt="Shared image" 
                                    className="w-full h-auto rounded-lg" 
                                  />
                                </DialogContent>
                              </Dialog>
                            ) : message.content.includes("dqsx8yzbs/video/") ? (
                              <video 
                                src={message.content} 
                                controls 
                                className="max-w-full h-40 rounded-lg"
                              />
                            ) : message.content.includes("dqsx8yzbs/raw/") ? (
                              <a
                                href={message.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                                  isOwn 
                                    ? "bg-white/20 hover:bg-white/30" 
                                    : "bg-gray-100 hover:bg-gray-200"
                                } transition-colors duration-200`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z"/>
                                </svg>
                                <span className="text-sm font-medium">
                                  {message.content.substring(message.content.lastIndexOf('/') + 1)}
                                </span>
                              </a>
                            ) : (
                              <p className="text-sm leading-relaxed break-words">
                                {message.content}
                              </p>
                            )}

                            {/* Message Info */}
                            <div className={`flex items-center justify-end gap-1 text-xs mt-2 ${
                              isOwn 
                                ? "text-white/70" 
                                : darkTheme 
                                  ? "text-gray-400" 
                                  : "text-gray-500"
                            }`}>
                              <span>{convertToIST(message.createdAt)}</span>
                              {isOwn && (
                                <CheckCheck 
                                  size={16} 
                                  className={`${
                                    message.read ? "text-blue-300" : "text-white/50"
                                  } transition-colors duration-200`}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`${
                      darkTheme ? "bg-gray-700" : "bg-white border border-gray-200"
                    } rounded-2xl px-4 py-3 shadow-lg`}>
                      <Lottie
                        animationData={typinganimation}
                        loop={true}
                        autoplay={true}
                        className="w-12 h-8"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Scrollbars>
          </div>

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
          <form onSubmit={sendMessage} className="flex items-center gap-3">
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
                  onChange={(e) => generatelink(e.target.files[0])}
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
              onChange={typingHandler}
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
        </div>
      )}
    </div>
  );
}

export default ChatSection;
