import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Groupchat from "./supports/Groupchat"; // Import Groupchat component
import { MessageCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Plus } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import AppSidebar from "./supports/AppSidebar";
import { useMediaQuery } from "react-responsive";

import { MessageSquareMoreIcon , LogOut ,User2  } from "lucide-react";

import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

function MyChats({open,setOpen,showchat,showsection,setshowchat}) {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
 
  const {
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    chats,
    setChats,
  } = ChatState();

  const [mdata, setm] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);  // State for opening group chat dialog
  const [sidebar,setsidebar] = useState(true);
  const fetchchats = async () => {
    if (!user || !user.token) {
      console.log("No user token found. Skipping API call.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("https://mern-chat-app-5-lyff.onrender.com/api/chat", config);
      setm(data);
      setChats(data);
    } catch (err) {
      console.log("Error fetching chats:", err);
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

  // Filter chats based on the search query
  const filteredChats = chats.filter((chat) => {
    if (chat.isGroupChat) {
      return chat.chatName.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const userName =
        chat.users[0]._id === user._id
          ? chat.users[1].name
          : chat.users[0].name;
      return userName.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <>  
    
  
      <div className={`bg-white text-black fixed   w-[20rem] ml-[5rem] h-lvh `}>
        <div>
          <div className="flex justify-between mx-6 my-3">
            <div className="text-[1.8rem]">Chats</div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Plus className="bg-green-200 p-1 mt-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>CHATTY</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(!open)}>Search New Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsGroupChatOpen(true)}>
                  Create a group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

         
          {isGroupChatOpen && <Groupchat setIsOpen={setIsGroupChatOpen} />}  {/* Pass setIsOpen to Groupchat */}

          <div className="w-[80%] mx-auto my-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                className="bg-gray-50 pl-10"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <ScrollArea className="bg-white h-lvh">
              {filteredChats.map((chat) => {
                return (
                  <div
                    key={chat._id} 
                    className={`cursor-pointer pl-2 ${
                      selectedChat === chat ? "bg-green-800 text-white" : "bg-gray-50"
                    }`}
                  
                    onClick={() => {setSelectedChat(chat) ; {isMobile?setshowchat(!showchat):""} }}
                  >
                    <div className="pl-[1rem] text-[0.9rem]">
                      {chat.isGroupChat ? (
                        <div className="flex gap-2 my-2 py-1">
                          <div>
                            <MessageCircle size={30} className={`${selectedChat==chat?"text-white":"text-black"}`} />
                          </div>
                          <div>{chat.chatName}</div>
                        </div>
                      ) : (
                        <div className="flex gap-2 my-2 py-2">
                          <img
                            src={
                              chat.users[0]._id === user._id
                                ? chat.users[1].pic
                                : chat.users[0].pic
                            }
                            className="w-[2rem] rounded-full"
                          />
                          <div>
                            {chat.users[0]._id === user._id
                              ? chat.users[1].name
                              : chat.users[0].name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        </div>
      </div>
      
    </>
  );
}

export default MyChats;
