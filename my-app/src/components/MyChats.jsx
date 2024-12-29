import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Groupchat from "./supports/Groupchat";
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
            const { data } = await axios.get("http://localhost:5000/api/chat", config);
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
        <Groupchat/>
            {console.log(mdata)}
            {console.log(chats.length)}
            <div>
                {chats.map((chat) => {
                    return (
                        <div key={chat._id}>
                            <div>
    {chat.isGroupChat ? (
        <div>
           
            <div>Group Chat: {chat.chatName}</div>
        </div>
    ) : (
        <div>
            
            <div>{chat.users[1].name}</div>
        </div>
    )}
</div>

                        </div>
                    );
                })}
            </div>
        </>
    );
    
}

export default MyChats;
