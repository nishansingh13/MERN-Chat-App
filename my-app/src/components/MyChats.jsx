import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Groupchat from "./supports/Groupchat"; // Import Groupchat component
import { File, FileVideo2, Image, MessageCircle, MessageSquareMore, MessageSquareText, Moon, Sun } from "lucide-react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useMediaQuery } from "react-responsive";
import group from "../assets/group.jpg";

import { LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { io } from "socket.io-client";

function MyChats({ open, setOpen, showchat, showsection, setshowchat, showprofile, setshowprofile }) {
  const [chatloading, setchatloading] = useState(false);
  const navigate = useNavigate();
  const [latestmessage, setlatestmessage] = useState("");
  const logout = () => {

    navigate("/");
    localStorage.removeItem("userInfo");

  }
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

  const {
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    chats,
    setChats,
    messages,
    setnewestmessage,
    newestmessage,
    darkTheme,
    setDarkTheme
  } = ChatState();
  const [mdata, setm] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);  // State for opening group chat dialog
  const [sidebar, setsidebar] = useState(true);

  const fetchchats = async () => {
    if (!user || !user.token) {
      console.log("No user token found. Skipping API call.");
      return;
    }

    try {
      setchatloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("https://mern-chat-app-fk6w.onrender.com/api/chat", config);
      setm(data);
      setChats(data);
    } catch (err) {
      console.log("Error fetching chats:", err);
    }
    finally {
      setchatloading(false);
    }
  };

  useEffect(() => {
    // Load user data from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo); // Update context state
    }
  }, []); // Run only once when the component mounts

  useEffect(() => {
    if (user && user.token) {
      fetchchats();
    }
  }, [user]); // Fetch chats when the user state changes

  const filteredChats = chats.filter((chat) => {
    if (!user || !user._id) return false; // Skip if user is not loaded

    if (chat.isGroupChat) {
      return chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const userName =
        chat.users && chat.users.length > 1
          ? chat.users[0]._id === user._id
            ? chat.users[1]?.name || "Unknown User"
            : chat.users[0]?.name || "Unknown User"
          : "Unknown Chat";
      return userName.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });
  const getLatestMessage = (chatId) => {
    return newestmessage[chatId] || selectedChat?.latestMessage?.content;
  };
  const handleDark = ()=>{
    setDarkTheme(!darkTheme);
    localStorage.setItem("theme", JSON.stringify(!darkTheme));
   
    
  }
  const returnproper = (query)=>{
    if(query.content.includes("dqsx8yzbs/image/upload")){
          
          return <span className="flex"><Image className={`${darkTheme?"text-white":"text-black"} p-1`}/> <span>Image</span></span>
    }
    else if(query.content.includes("dqsx8yzbs/video/upload")){
          
      return <span className="flex"><FileVideo2 className={`${darkTheme?"text-white":"text-black"} p-1`}/> <span>Video</span></span>
}
else if(query.content.includes("dqsx8yzbs/raw/upload")){
          
  return <span className="flex"><File className={`${darkTheme?"text-white":"text-black"} p-1`}/> <span>File</span></span>
}
    return query.content;
  }

  useEffect(() => {

  }, [newestmessage]);

  return (
    <>


      <div className={`${darkTheme?"bg-[#2a2929]":"bg-[#F5F6FA]"}  text-black fixed  ${isMobile ? "ml-0 w-full" : ""} w-[25rem] ml-0 h-lvh `}>

        <div>
          <div className="flex justify-between mx-6 my-3">
            <div className={`text-[1.8rem] ${darkTheme?"text-orange-500":"text-green-600"} flex font-semibold gap-2`}>
              <div><MessageSquareText className="relative top-3" /></div>
              <div>Chatify</div>
            </div>
            <DropdownMenu >
              <DropdownMenuTrigger >
                <MoreVertical className={`${darkTheme?"bg-orange-500":"bg-green-500"} rounded-sm p-1`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${darkTheme && "bg-[#1e1e1e] text-white"}`}>
                <DropdownMenuLabel>CHATIFY</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setshowprofile(!showprofile)} >My Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(!open)} className="cursor-pointer">Search New Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsGroupChatOpen(true)} className="cursor-pointer">
                  Create a group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <div className="flex gap-1 cursor-pointer">
                    <LogOut size={20} onClick={logout} />
                    <div>Logout</div>
                  </div>

                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDark} className="cursor-pointer">
                  <div className="flex gap-1 cursor-pointer">
                    {darkTheme?(<Moon size={20}/>):(
                    <Sun  size={20}/>)}
                   
                    <div>{darkTheme?"Dark":"Light"} Theme</div>
                  </div>

                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>


          {isGroupChatOpen && <Groupchat setIsOpen={setIsGroupChatOpen} />}  {/* Pass setIsOpen to Groupchat */}

          <div className="w-[80%] mx-auto my-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                className={`${darkTheme?"border-orange-500 bg-[#353434] text-white":"bg-gray-50"} pl-10`}
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={`${darkTheme?"bg-[#1e1e1e]":"bg-white"} py-2 px-2 m-[1rem]  rounded-2xl `}>
            <ScrollArea className=" h-[calc(100lvh-10rem)] " >
              {
                chatloading ? (
                  <div className="flex flex-col gap-4 ">
                    <div className="flex items-center space-x-4 ">
                      <Skeleton className={`h-12 w-12 rounded-full ${darkTheme && "bg-zinc-700"} `} />
                      <div className="space-y-2  ">
                        <Skeleton className={`h-4 w-[250px]  ${darkTheme && "bg-zinc-700"}`} />
                        <Skeleton className={`h-4 w-[200px]  ${darkTheme && "bg-zinc-700"}`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ">
                      <Skeleton className={`h-12 w-12 rounded-full ${darkTheme && "bg-zinc-700"} `} />
                      <div className="space-y-2  ">
                        <Skeleton className={`h-4 w-[250px]  ${darkTheme && "bg-zinc-700"}`} />
                        <Skeleton className={`h-4 w-[200px]  ${darkTheme && "bg-zinc-700"}`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ">
                      <Skeleton className={`h-12 w-12 rounded-full ${darkTheme && "bg-zinc-700"} `} />
                      <div className="space-y-2  ">
                        <Skeleton className={`h-4 w-[250px]  ${darkTheme && "bg-zinc-700"}`} />
                        <Skeleton className={`h-4 w-[200px]  ${darkTheme && "bg-zinc-700"}`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ">
                      <Skeleton className={`h-12 w-12 rounded-full ${darkTheme && "bg-zinc-700"} `} />
                      <div className="space-y-2  ">
                        <Skeleton className={`h-4 w-[250px]  ${darkTheme && "bg-zinc-700"}`} />
                        <Skeleton className={`h-4 w-[200px]  ${darkTheme && "bg-zinc-700"}`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ">
                      <Skeleton className={`h-12 w-12 rounded-full ${darkTheme && "bg-zinc-700"} `} />
                      <div className="space-y-2  ">
                        <Skeleton className={`h-4 w-[250px]  ${darkTheme && "bg-zinc-700"}`} />
                        <Skeleton className={`h-4 w-[200px]  ${darkTheme && "bg-zinc-700"}`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ">
                      <Skeleton className={`h-12 w-12 rounded-full ${darkTheme && "bg-zinc-700"} `} />
                      <div className="space-y-2  ">
                        <Skeleton className={`h-4 w-[250px]  ${darkTheme && "bg-zinc-700"}`} />
                        <Skeleton className={`h-4 w-[200px]  ${darkTheme && "bg-zinc-700"}`} />
                      </div>
                    </div>
                  </div>

                ) : (
                  filteredChats.map((chat) => {
                    const validUsers = chat.users?.filter((u) => u && u._id);

                    if (!validUsers || validUsers.length < 2) {
                      console.warn(`Chat with ID ${chat._id} has missing users. Skipping.`);
                      return null;
                    }

                    const otherUser =
                      validUsers[0]._id === user._id ? validUsers[1] : validUsers[0];

                    const latestmessage = chat.latestMessage?.content;

                    return (
                      <div
                        key={chat._id}
                        className={`cursor-pointer pl-2 rounded-xl ${selectedChat === chat
                            ? `${darkTheme?"bg-orange-500 text-black":"bg-green-600 text-white"} `
                            : `hover:transition-all hover:bg-gray-200 bg-gray-50 ${darkTheme?"bg-zinc-800 text-white hover:bg-zinc-700":""}`
                          }`}

                        onClick={() => {
                          setSelectedChat(chat);
                          isMobile ? setshowchat(!showchat) : "";
                        }}
                      >
                        <div className="pl-[1rem] text-[0.9rem] ">
                          {chat.isGroupChat ? (
                            <div className="flex gap-2 my-2 py-2">
                              <img
                                src={group}
                                alt="User"
                                className="w-[2.5rem] h-[2.5rem] rounded-full"
                              />
                              <div>
                                <div>{chat.chatName}</div>
                                <div className={`text-gray-500`}>
                                  {
                                    newestmessage[chat?._id] !== undefined
                                      ? newestmessage[chat._id]
                                      : (chat.latestMessage ? chat.latestMessage.content : "")
                                  }
                                </div>
                              </div>

                            </div>
                          ) : (
                            <div>
                              <div className={`flex gap-2 my-2 py-2`}>
                                <img
                                  src={otherUser?.pic || ""}
                                  alt="User"
                                  className="w-[2.5rem] h-[2.5rem] rounded-full"
                                />
                                <div>
                                  <div>{otherUser?.name || "Unknown User"}</div>
                                  <div className={`text-gray-500`}>
                                    {
                                      newestmessage[chat?._id] !== undefined
                                        ? newestmessage[chat._id]
                                        : (chat.latestMessage ?returnproper(chat.latestMessage) : "")
                                    }
                                  </div>

                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      </div>

                    );
                  })
                )
              }
            </ScrollArea>
          </div>
        </div>
      </div>

    </>
  );
}

export default MyChats;
