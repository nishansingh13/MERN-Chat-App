import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Groupchat from "./supports/Groupchat";
import { MessageCircle } from 'lucide-react';
function MyChats() {
    const {
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
    } = ChatState();
    
    const [mdata, setm] = useState([]);

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
            const { data } = await axios.get("http://192.168.1.9:5000/api/chat", config);
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

    return (
        <>  
        <div className=" absolute top-[4rem] bg-blue-400 h-[42.5rem] w-[30rem] x-2 overflow-auto">
        <Groupchat/>
            {console.log(mdata)}
            {console.log(chats.length)}
            
            <div>
                {chats.map((chat) => {
                    return (

                <div key={chat._id} className={`cursor-pointer pl-2 bg-black ${selectedChat==chat?"bg-green-400   ":"bg-gray-400"}`} onClick={()=>setSelectedChat(chat)}>
                                
                            <div>
    {chat.isGroupChat ? (
        <div className="flex gap-2 my-2 py-2">
            <div><MessageCircle size={30} className="text-white"/></div>
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
  {
    chat.users[0]._id === user._id 
    ? chat.users[1].name 
    : chat.users[0].name
  }
</div>

        </div>
    )}
</div>

                        </div>
                    );
                })}
            </div>
            </div>
        </>
    );
    
}

export default MyChats;
