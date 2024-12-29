import { ChatState } from "@/Context/ChatProvider";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";

function ChatBox() {
  const { selectedChat,user,setSelectedChat } = ChatState();
  const [messages,setmessages] = useState([]);
  const [loading,setloading] = useState(false);
  const [newmessage,setnewmessage] = useState("");
//   console.log(selectedChat,"selectedchats");
const fetchmessages = async () => {
    if (!selectedChat) return;

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        setloading(true); // Show loading
        const { data } = await axios.get(
            `http://localhost:5000/api/message/${selectedChat._id}`,
            config
        );

        console.log("Fetched messages:", data); // Log the fetched data

        setmessages(data); // Update the messages state with the fetched data
        setloading(false); // Hide loading

    } catch (err) {
        console.error("Error fetching messages:", err);
    }
};

useEffect(()=>{
    fetchmessages();
},[selectedChat])
  const sendmessage = async (e) => {
    if (e.key === "Enter" && newmessage) {
      e.preventDefault();
  
      try {
        // Send message request to the server
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newmessage,
            chatId: selectedChat._id,
          },
          config
        );
  
        // Update the messages state with the new message
        setmessages([...messages, data]);
  
        // Clear the new message input
        setnewmessage("");
        console.log(data);
      } catch (err) {
        alert("Error sending message");
      }
    }
  };
  
    const typinghandler = (e)=>{
        setnewmessage(e.target.value);
        // console.log(newmessage)
    }
  return (
    <>
      <div className={`ml-[30rem] top-[4rem] h-lvh bg-blue-200 ${!selectedChat?"text-black flex items-center justify-center":""}`}>
        {!selectedChat ? (
          <div className="text-[2rem]">YOHOHO CHATS PE CLICK KROOO!!</div>
        ) : (
          <div>
            {!selectedChat.isGroupChat?(
                <div>
                    <div className="relative text-[2rem] p-4">{selectedChat.users[1].name}</div>
                    <form action="" onKeyDown={sendmessage} >
                        <label htmlFor="H"></label>
                    
                        <Input className="border border-r-black mx-2 relative top-[33rem] placeholder:text-black" placeholder ="Enter message here "  onChange = {typinghandler} value={newmessage}></Input>
                    </form>
                    </div>
            ):( <div >
                <div className="relative text-[2rem] p-4">{selectedChat.chatName}</div>  
                </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}

export default ChatBox;
