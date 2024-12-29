import React, { useEffect, useState } from "react";

import DropDown from "@/components/supports/DropDown";
import AppSidebar from "@/components/supports/AppSidebar";
import { ChatState } from "@/Context/ChatProvider";
import MyChats from "@/components/MyChats";

function ChatPage() {
  const {user} = ChatState();
  const [open, setOpen] = useState(false);
 
  return (
    
    <div className="bg-blue-200 h-lvh">
      <div className="flex justify-between px-[1rem] bg-white mt-2">
        <div onClick={() => setOpen(!open)}>Search User</div>
        <div>BAATEIN</div>
        <div className="flex">
          <DropDown />
        </div>
      
      </div>
      <MyChats/>
      <AppSidebar open={open} setOpen={setOpen} />
     
      
    </div>
    
  );
}

export default ChatPage;
