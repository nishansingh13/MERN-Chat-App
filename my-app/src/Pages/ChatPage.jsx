import React from "react";
import { ChatState } from "../Context/ChatProvider";
import Sidebar from "../components/supports/Sidebar";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button";
function ChatPage(){
    const { toast } = useToast()
 
    return (
        <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
          duration: 2000,
          className: "bg-black text-white p-4 rounded-lg shadow-md flex items-center",  // Tailwind classes
        });
      }}
    >
        Show Toast
      </Button>
    )
}
export default ChatPage;