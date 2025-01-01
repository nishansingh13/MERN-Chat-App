import React, { useState } from "react";
import { ChatState } from "@/Context/ChatProvider";
import MyChats from "@/components/MyChats";
import Slider from "@/components/supports/Slider";
import ChatSection from "@/components/ChatSection";
import { useMediaQuery } from "react-responsive";



function ChatPage() {
  const { user } = ChatState();
  const [checked,setchecked]=useState(false);
  const [showsection, setshowsection] = useState(true);
  const [open, setOpen] = useState(false);
  const [showchat, setshowchat] = useState(false);
  const [leftbar, showleftbar] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
 
  return (
    <div className={``}>
    <div className="h-[41.5rem] md:h-lvh overflow-hidden">
     

      {!showchat && (
        <MyChats
          open={open}
          setOpen={setOpen}
          showsection={showsection}
          showchat={showchat}
          setshowchat={setshowchat}
          showleftbar={showleftbar}
        />
      )}

      {isMobile ? (
        showchat && <ChatSection leftbar={leftbar} showleftbar={showleftbar} showchat={showchat} setshowchat={setshowchat} />
      ) : (
        !showchat && <ChatSection leftbar={leftbar} showleftbar={showleftbar}  />
      )}

      <Slider open={open} setOpen={setOpen} showsection={showsection} showchat={showchat} />
    </div>
    </div>
  );
}

export default ChatPage;