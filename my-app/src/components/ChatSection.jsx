import { ChatState } from "@/Context/ChatProvider";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars-2";
import { io } from "socket.io-client";
import image from "../assets/background.jpg";


function ChatSection() {
  const endpoint = "http://192.168.1.9:5000";
  const { selectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);  // Using useRef to store the socket instance

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

      if (socketRef.current) {
        socketRef.current.emit("join chat", selectedChat._id);  // Use socket from useRef
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (selectedChat && user) {
      fetchMessages();  // Fetch messages when selectedChat or user changes
    }
  }, [selectedChat, user]);

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

        setNewMessage("");  // Clear input field

        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, data]);

        //ok
        // Emit the new message to the socket
        if (socketRef.current) {
          socketRef.current.emit("new message", data);
        }
      } catch (err) {
        alert("Error sending message");
      }
    }
  };
  const getChatName = () => {
    if (selectedChat.isGroupChat) {
      return selectedChat.chatName;
    }
    return selectedChat.users[0]._id === user._id
      ? selectedChat.users[1].name
      : selectedChat.users[0].name;
  };
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io(endpoint);
      socketRef.current.emit("setup", user);
      socketRef.current.on("connection", () => {
        console.log("Socket connected");
      });
    }
  }, [user]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message received", (newmessage) => {
        if (selectedChat && selectedChat._id === newmessage.chat._id) {
          setMessages((prevMessages) => [...prevMessages, newmessage]);
        }
      });
    }
  }, [selectedChat,user]);

  return (
    <div className="ml-[25rem] top-[4rem] h-lvh bg-blue-200"  style={{
      backgroundImage: `url(${image})`, // Replace 'your-image-url' with the actual image URL
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
       filter: "blur(0px)",
       
    }} >
      {!selectedChat ? (
        <div className="text-black flex items-center justify-center text-[2rem]">
          YOHOHO CHATS PE CLICK KROOO!!
        </div>
      ) : (
        <div>
          <img src={`${!selectedChat.isGroupChat}?""`} />
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

export default ChatSection;
