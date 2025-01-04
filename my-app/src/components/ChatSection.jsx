import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars-2";
import { io } from "socket.io-client";
import { Separator  } from "./ui/separator";
import { ChatState } from "@/Context/ChatProvider";
import EmojiPicker from "emoji-picker-react";
import { Smile ,ArrowLeftIcon, Loader2, MessageSquareText, Plus} from "lucide-react";
import Lottie from "lottie-react";
import typinganimation from "../assets/typing_animation.json";
import { Settings } from "lucide-react";
import { SendHorizonal } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import group from "../assets/group.jpg";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
var selectedChatcompare;
function ChatSection({ showchat, setshowchat, leftbar, showleftbar }) {
  const endpoint = "http://192.168.1.9:5000/";
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { selectedChat, user, notification, setNotification ,setnewestmessage} = ChatState();
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [plusloading,setplusloading]=useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({query:"(max-width:768px)"});  
  const {messages,setMessages} = ChatState();
  const updateNewestMessage = (chatId, message) => {
    setnewestmessage((prevState) => ({
      ...prevState,
      [chatId]: message, // Set the newest message for the specific chat
    }));
  };
  
  
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
          "http://192.168.1.9:5000/api/message",
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
    <div className="text-white bg-white h-lvh  flex flex-col items-center justify-center text-[2rem] overflow-hidden ">
      
      <div className="flex gap-2 font-semibold text-green-600">
        <div className="relative top-3"><MessageSquareText size={30}/></div>
      
        <div className="">Chatify {!isMobile?"Web":""}</div>
      </div>

      <div className="text-[60%] text-green-600">Responsive Chatting Web App</div>
     


    </div>
  ) : (
    loading ? (
      
      <div className="flex justify-center items-center h-full">
        <div><Loader2 className="animate-spin text-green-600" size={80}/></div>
      </div>
    ) : (
      // The rest of your chat content here
      <div className={`overflow-hidden`}>
        <div className={`${isDesktop ? "pt-[1.5rem] pb-4 px-3 mt-2 mx-2 rounded-xl bg-gray-200" : "pt-3 px-3 mr-1"}`}>
          <div className="relative flex items-center justify-between ">
            <div className="flex">
              {isMobile && (
                <ArrowLeftIcon
                  className="relative top-3"
                  onClick={() => setshowchat(!showchat)}
                />
              )}
              <Dialog >
              <DialogTrigger>
                
              <img
                src={`${!selectedChat.isGroupChat ? getChatName().pic : group}`}
                className="w-[3.5rem] h-[3.5rem] rounded-full p-1"
              />
              </DialogTrigger>
              <DialogContent className="bg-gray-300">
    <DialogHeader>
      <DialogTitle>User Info</DialogTitle>
      <DialogDescription>
       <img   src={`${!selectedChat.isGroupChat ? getChatName().pic : group}`} className={`p-[4rem] ${!isMobile?"w-[30rem] h-[30rem]":"w-[20rem] h-[20rem]"} rounded-full`} />
      </DialogDescription>
      <div className="mx-auto relative bottom-[3rem] "><span className="font-semibold ">Email: </span>{getChatName()?.email}</div>
    </DialogHeader>
  </DialogContent>
  </Dialog>
              
              <div className="text-[1.5rem] px-2 relative top-1">
                {!selectedChat.isGroupChat ? getChatName().name : getChatName()}
              </div>
            </div>
            <div>
              <Settings onClick={() => showleftbar(!leftbar)} />
            </div>
          </div>
        </div>

        <Separator className={`${isMobile ? "relative top-4" : "relative top-2"}`} />

        <div className={`w-full ${isMobile ? "mt-0 h-[540px]" : "mt-[2rem] h-[540px]"}`}>
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            className="mt-[1rem]"
            ref={scrollRef}
          >
          
            <div className="p-4">

              {messages.map((u,index) => (
                <div key={u._id}> 
                {/* {console.log( messages[index-1],"index",index)} */}
                <div
                  
                  className={`${
                    u.sender._id === user._id
                      ? "bg-green-100 p-1 my-2 ml-auto text-left"
                      : "bg-blue-300 my-2 p-1 mr-auto text-left"
                  } w-fit ${isMobile?"max-w-[50%]":"max-w-[35%]"} break-words p-2 rounded-md
                `}
                  style={{
                    borderRadius:
                      u.sender._id === user._id
                        ? "10px 10px 0 10px"
                        : "10px 10px 10px 0",
                  }}
                >  {u.chat.isGroupChat && u.sender._id!==user._id &&
                  <div className="text-[60%] text-gray-500 mr-auto text-right">{u.sender.name}</div>}
{u.content.startsWith("https:") && u.content.endsWith(".png") ? (
          <Dialog >
          <DialogTrigger>
            
          <img src={u.content} alt="Image message" className="w-full h-auto" />
          </DialogTrigger>
          <DialogContent className="bg-gray-300">
<DialogHeader>

  <DialogDescription>
  <img src={u.content} alt="Image message" className="w-full h-auto" />
  </DialogDescription>
</DialogHeader>
</DialogContent>
</Dialog>
       

) : u.content.includes("dqsx8yzbs/video/") ? (
  <video src={u.content} controls className="w-full h-[10rem]" />
) : u.content.includes("dqsx8yzbs/raw/") && u.content.endsWith(".pdf") ? (
  <a
    href={u.content}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 underline"
  >
    Open PDF
  </a>
) : u.content.includes("dqsx8yzbs/raw/") ? (
  <a
    href={u.content}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 underline underline-offset-4"
  >
    { u.content.substring(u.content.lastIndexOf('/') + 1)}
   
  </a>
) : (
  u.content
)}

                  <span className="text-right text-[65%] relative top-2 text-gray-500">  {convertToIST(u.createdAt)}</span>
                
     
                </div>
            
{
  u.chat.isGroupChat && (
   
    ((index === messages.length - 1 || messages[index + 1]?.sender._id !== u.sender._id) && u.sender._id!==user._id ) && (
      
      <div className={`
        ${u.sender._id === user._id ? "ml-auto text-left" : "mr-auto text-left"}
        w-fit max-w-[35%] break-words pb-2 px-1 rounded-md text-[80%]
      `}>
      <div 
      
      >
         
        <img src={u.sender.pic}  className="w-[1.6rem] h-[1.6rem] rounded-full"/>
        
      </div>
      </div>
    )
  )
}




               
 

                </div>
                
               
              ))}
            </div>
            <div className="w-[4rem] h-[2rem]">
              {isTyping && (
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
  <form onSubmit={sendMessage} className="flex gap-5 ">
            <button
              type="button"
              className="bottom-[120px] left-[50%] transform -translate-x-1/2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
             
              <Smile className={`relative ${isMobile ? "left-5 top-1" : "left-[1.6rem] top-2"}`} />
            </button>
           {!plusloading?(
            <button
              type="button"
              className="bottom-[120px] left-[50%] transform -translate-x-1/2"
              
            >
             <label htmlFor="file-put">
              <Plus className={`relative ${isMobile ? "left-5 top-1" : "left-[1.6rem] top-2"} cursor-pointer`} />
              </label>
              <input type="file" className="hidden"  id="file-put" onChange={(e)=>generatelink(e.target.files[0])}/>
         </button>
):(
  <div className={`${!isMobile?"top-5":"top-3"} left-1 text-green-600 relative`}><Loader2 className="animate-spin"/></div>
)}
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
    )
  )
}

    </div>
  );
}

export default ChatSection;
