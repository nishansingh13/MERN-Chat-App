import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Groupchat from "./supports/Groupchat"; // Import Groupchat component
import { MessageCircle, MessageSquareMore, MessageSquareText } from "lucide-react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { MoreVertical} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useMediaQuery } from "react-responsive";


import {   LogOut   } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

function MyChats({open,setOpen,showchat,showsection,setshowchat ,showprofile,setshowprofile}) {
  const [chatloading,setchatloading] = useState(false);
  const navigate = useNavigate();
  const logout = ()=>{
    
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
      setchatloading(true);
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
    finally{
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


  return (
    <>  
    
  
      <div className={`bg-[#F5F6FA] text-black fixed  ${isMobile?"ml-0 w-full":""} w-[25rem] ml-0 h-lvh `}>
        
        <div>
          <div className="flex justify-between mx-6 my-3">
            <div className="text-[1.8rem] text-green-600 flex font-semibold gap-2">
              <div><MessageSquareText className="relative top-3"/></div>
              <div>Chatify</div>
            </div>
            <DropdownMenu >
              <DropdownMenuTrigger >
                <MoreVertical className="bg-green-500 rounded-sm p-1 " />
              </DropdownMenuTrigger>
              <DropdownMenuContent >
                <DropdownMenuLabel>CHATIFY</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setshowprofile(!showprofile)} >My Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(!open)} className="cursor-pointer">Search New Users</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsGroupChatOpen(true)} className="cursor-pointer">
                  Create a group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <div className="flex gap-1 cursor-pointer"> 
                    <LogOut size={20} onClick={logout}/>
                    <div>Logout</div>
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
                className="bg-gray-50 pl-10"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white py-2 px-2 m-[1rem] border rounded-2xl ">
            <ScrollArea className=" h-[calc(100lvh-10rem)]
">
            {
  chatloading ? (
   <div className="flex flex-col gap-4">
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    </div>
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    </div>
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    </div>
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    </div>
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    </div>
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
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

      return (
        <div
        key={chat._id}
        className={`cursor-pointer pl-2 rounded-xl ${
          selectedChat === chat 
            ? "bg-green-600 text-white" 
            : "hover:transition-all hover:bg-gray-200 bg-gray-50"
        }`}
        
          onClick={() => {
            setSelectedChat(chat);
            isMobile ? setshowchat(!showchat) : "";
          }}
        >
          <div className="pl-[1rem] text-[0.9rem]">
            {chat.isGroupChat ? (
              <div className="flex gap-2 my-2 py-1">
                <div>
                  <MessageCircle size={30} className={`${selectedChat === chat ? "text-white" : "text-black"}`} />
                </div>
                <div>{chat.chatName}</div>
              </div>
            ) : (
              <div className="flex gap-2 my-2 py-2">
                <img
                  src={otherUser?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                  alt="User"
                  className="w-[2rem] rounded-full"
                />
                <div>{otherUser?.name || "Unknown User"}</div>
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
