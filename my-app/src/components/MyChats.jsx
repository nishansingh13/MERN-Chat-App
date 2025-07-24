import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Groupchat from "./supports/Groupchat";
import { File, FileVideo2, Image, MessageCircle, MessageSquareText, Moon, Sun } from "lucide-react";
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
import { Avatar } from "./ui/avatar";

function MyChats({ open, setOpen, showchat, setshowchat, showprofile, setshowprofile }) {
  const [chatloading, setchatloading] = useState(false);
  const navigate = useNavigate();
  
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const {
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    chats,
    setChats,
    newestmessage,
    darkTheme,
    setDarkTheme
  } = ChatState();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);

  const logout = () => {
    navigate("/");
    localStorage.removeItem("userInfo");
  };

  const fetchchats = useCallback(async () => {
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
      setChats(data);
    } catch (err) {
      console.log("Error fetching chats:", err);
    } finally {
      setchatloading(false);
    }
  }, [user, setChats]);

  useEffect(() => {
    // Load user data from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, [setUser]);

  useEffect(() => {
    if (user && user.token) {
      fetchchats();
    }
  }, [user, fetchchats]);

  const filteredChats = chats.filter((chat) => {
    if (!user || !user._id) return false;

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

  const handleDark = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("theme", JSON.stringify(!darkTheme));
  };

  const returnproper = (query) => {
    if (query.content.includes("dqsx8yzbs/image/upload")) {
      return <span className="flex"><Image className={`${darkTheme ? "text-white" : "text-black"} p-1`}/> <span>Image</span></span>
    }
    else if (query.content.includes("dqsx8yzbs/video/upload")) {
      return <span className="flex"><FileVideo2 className={`${darkTheme ? "text-white" : "text-black"} p-1`}/> <span>Video</span></span>
    }
    else if (query.content.includes("dqsx8yzbs/raw/upload")) {
      return <span className="flex"><File className={`${darkTheme ? "text-white" : "text-black"} p-1`}/> <span>File</span></span>
    }
    return query.content;
  };

  return (
    <>
      <div className={`${
        darkTheme 
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-b from-white via-gray-50 to-gray-100"
      } ${
        isMobile ? "fixed inset-0 z-30" : "fixed left-0 top-0 bottom-0 w-96"
      } border-r ${
        darkTheme ? "border-gray-700" : "border-gray-200"
      } shadow-2xl backdrop-blur-sm flex flex-col`}>
        
        {/* Header Section */}
        <div className={`flex-shrink-0 ${
          darkTheme 
            ? "bg-gradient-to-r from-orange-600 to-amber-600" 
            : "bg-gradient-to-r from-emerald-600 to-green-600"
        } px-6 py-4 shadow-lg`}>
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <MessageSquareText size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Chatify</h1>
            </div>
            
            {/* Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-white/20 rounded-full transition-all duration-200">
                <MoreVertical size={20} className="text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${
                darkTheme ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-200"
              } shadow-xl rounded-xl p-2 w-56`}>
                <DropdownMenuLabel className={`${
                  darkTheme ? "text-orange-400" : "text-emerald-600"
                } font-semibold text-center pb-2`}>
                  CHATIFY
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={darkTheme ? "bg-gray-700" : "bg-gray-200"} />
                
                <DropdownMenuItem 
                  className={`cursor-pointer rounded-lg px-3 py-2 ${
                    darkTheme ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors duration-200`}
                  onClick={() => setshowprofile(!showprofile)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MP</span>
                    </div>
                    <span>My Profile</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className={`cursor-pointer rounded-lg px-3 py-2 ${
                    darkTheme ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors duration-200`}
                  onClick={() => setOpen(!open)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Search size={16} className="text-white" />
                    </div>
                    <span>Search New Users</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className={`cursor-pointer rounded-lg px-3 py-2 ${
                    darkTheme ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors duration-200`}
                  onClick={() => setIsGroupChatOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <span>Create a Group</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className={`cursor-pointer rounded-lg px-3 py-2 ${
                    darkTheme ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors duration-200`}
                  onClick={handleDark}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${
                      darkTheme ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-gray-600 to-gray-800"
                    } rounded-full flex items-center justify-center`}>
                      {darkTheme ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
                    </div>
                    <span>{darkTheme ? "Light" : "Dark"} Theme</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className={darkTheme ? "bg-gray-700" : "bg-gray-200"} />
                
                <DropdownMenuItem 
                  className={`cursor-pointer rounded-lg px-3 py-2 ${
                    darkTheme ? "hover:bg-red-900/50" : "hover:bg-red-50"
                  } transition-colors duration-200`}
                  onClick={logout}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <LogOut size={16} className="text-white" />
                    </div>
                    <span className="text-red-600">Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>


        {/* Group Chat Modal */}
        {isGroupChatOpen && <Groupchat setIsOpen={setIsGroupChatOpen} />}

        {/* Search Section */}
        <div className="flex-shrink-0 px-6 py-4">
          <div className="relative">
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              darkTheme ? "text-gray-400" : "text-gray-500"
            }`}>
              <Search size={20} />
            </div>
            <Input
              className={`${
                darkTheme 
                  ? "border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20" 
                  : "border-gray-300 bg-white/80 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              } pl-12 pr-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg`}
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List Section */}
        <div className="flex-1 px-4 pb-4 min-h-0">
          <div className={`${
            darkTheme 
              ? "bg-gray-800/30 border-gray-700" 
              : "bg-white/60 border-gray-200"
          } rounded-2xl border backdrop-blur-sm shadow-lg h-full flex flex-col`}>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-2">
              {chatloading ? (
                /* Loading Skeletons */
                <div className="space-y-3 p-2">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3">
                      <Skeleton className={`h-12 w-12 rounded-full ${
                        darkTheme ? "bg-gray-700" : "bg-gray-200"
                      }`} />
                      <div className="flex-1 space-y-2">
                        <Skeleton className={`h-4 w-3/4 ${
                          darkTheme ? "bg-gray-700" : "bg-gray-200"
                        }`} />
                        <Skeleton className={`h-3 w-1/2 ${
                          darkTheme ? "bg-gray-700" : "bg-gray-200"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Chat Items */
                <div className="space-y-1 p-2">
                  {filteredChats.map((chat) => {
                    const validUsers = chat.users?.filter((u) => u && u._id);

                    if (!validUsers || validUsers.length < 2) {
                      console.warn(`Chat with ID ${chat._id} has missing users. Skipping.`);
                      return null;
                    }

                    const otherUser = validUsers[0]._id === user._id ? validUsers[1] : validUsers[0];
                    const isSelected = selectedChat === chat;

                    return (
                      <div
                        key={chat._id}
                        className={`
                          cursor-pointer rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] 
                          ${isSelected
                            ? `${
                                darkTheme 
                                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg" 
                                  : "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                              }`
                            : `${
                                darkTheme 
                                  ? "hover:bg-gray-700/50 text-gray-200" 
                                  : "hover:bg-gray-100/80 text-gray-800"
                              }`
                          }
                        `}
                        onClick={() => {
                          setSelectedChat(chat);
                          if (isMobile) setshowchat(!showchat);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            {chat.isGroupChat ? (
                              <img
                                src={group}
                                alt="Group Avatar"
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                              />
                            ) : (
                              <Avatar
                                src={otherUser?.pic}
                                name={otherUser?.name}
                                alt="Avatar"
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                              />
                            )}
                          </div>

                          {/* Chat Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-sm truncate">
                                {chat.isGroupChat ? chat.chatName : (otherUser?.name || "Unknown User")}
                              </h3>
                            </div>
                            
                            {/* Latest Message */}
                            <div className={`text-xs truncate ${
                              isSelected 
                                ? "text-white/80" 
                                : darkTheme 
                                  ? "text-gray-400" 
                                  : "text-gray-500"
                            }`}>
                              {newestmessage[chat?._id] !== undefined
                                ? newestmessage[chat._id]
                                : chat.latestMessage
                                  ? (chat.isGroupChat 
                                      ? chat.latestMessage.content 
                                      : returnproper(chat.latestMessage))
                                  : "No messages yet"
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyChats;
