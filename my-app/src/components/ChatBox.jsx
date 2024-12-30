import { ChatState } from "@/Context/ChatProvider";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars-2";
import {Bubble} from 'react-chat-bubble';
import { io } from "socket.io-client";

function ChatBox() {
  
  const endpoint = "http://localhost:5000";
  var socket,selectedChatcompare;
  const { selectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketconnected,setsocketconnected] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

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
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      e.preventDefault();

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

        setNewMessage(""); // Clear input
        fetchMessages(); // Fetch latest messages
      } catch (err) {
        alert("Error sending message");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  // useEffect(()=>{
  //   console.log('User data being sent to socket:', user);
  //   socket = io(endpoint);
  //   socket.emit("setup",user);
  //   socket.on("connection",()=>setsocketconnected(true));
  // },[])

  return (
    <div className="ml-[30rem] top-[4rem] h-lvh bg-blue-200">
      {!selectedChat ? (
        <div className="text-black flex items-center justify-center text-[2rem]">
          YOHOHO CHATS PE CLICK KROOO!!
        </div>
      ) : (
        <div>
          <div className="relative text-[2rem] p-4 top-[4rem]">
            {!selectedChat.isGroupChat
              ? selectedChat.users[0]._id === user._id
                ? selectedChat.users[1].name
                : selectedChat.users[0].name
              : selectedChat.chatName}
          </div>

          <div className="h-[400px] w-full mt-[5rem]">
              
            <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200} className="mt-[2rem]">
              <div className="p-4">
                
                {messages.map((u) => (
                  <div
                    key={u._id}
                    className={`${
                      u.sender._id === user._id
                        ? "bg-green-100 my-2 relative left-[80%]"
                        : "bg-blue-300 my-2"
                    } w-fit p-2 rounded-md`}
                  >
                    {u.content}
                    
                  </div>
                ))}
                
              </div>
            </Scrollbars>
          </div>

          <form action="" onKeyDown={sendMessage} className="">
            <div className=" fixed ml-[4rem] top-[40rem] border border-black w-[60%]">
            <Input
              className="  placeholder:text-black  "
              placeholder="Enter message here"
              onChange={typingHandler}
              value={newMessage}
            />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
