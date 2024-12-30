import React, { useEffect, useState } from "react";

import DropDown from "@/components/supports/DropDown";
import AppSidebar from "@/components/supports/AppSidebar";
import { ChatState } from "@/Context/ChatProvider";
import MyChats from "@/components/MyChats";
import { Search } from "lucide-react";
import Slider from "@/components/supports/Slider";
import ChatBox from "@/components/ChatBox";
import ChatSection from "@/components/ChatSection";
function ChatPage() {
  const {user} = ChatState();
  const [open, setOpen] = useState(false);

  return (
    
    <div className="bg-blue-200 h-lvh overflow-hidden">
      {/* <div className="flex justify-between px-[1rem] bg-white py-1 fixed w-full">
        <div onClick={() => setOpen(!open)} className="flex cursor-pointer"> <Search className="p-1 pb-[0.3rem] "/> <span> Search User</span></div>
        <div className="text-[1.5rem] italic font-bold">BAATEIN WITH CHAI</div>
        <div className="flex">
          <DropDown />
        </div>
      
      </div> */}
      <MyChats open = {open} setOpen = {setOpen}/>
      <ChatSection/>
      <Slider open={open} setOpen={setOpen} />

     
      
    </div>
    
  );
}

export default ChatPage;
