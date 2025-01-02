import React, { useState } from "react";
import { ChatState } from "@/Context/ChatProvider";
import MyChats from "@/components/MyChats";
import Slider from "@/components/supports/Slider";
import ChatSection from "@/components/ChatSection";
import { useMediaQuery } from "react-responsive";
import ProfileSection from "@/components/supports/ProfileSection";

function ChatPage() {
  const { user } = ChatState();
  const [checked, setchecked] = useState(false);
  const [showsection, setshowsection] = useState(false);
  const [open, setOpen] = useState(false);
  const [showprofile,setshowprofile] = useState(false);
  const [showchat, setshowchat] = useState(false);
  const [leftbar, showleftbar] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div className={`${!isMobile && "bg-green-600"}`}>
      <div
        className={`scale-x-[98%] scale-y-[95%] border rounded-2xl overflow-hidden`}
      >
        <div className="h-[41.5rem] md:h-lvh overflow-hidden">
          {!showchat && (
            <MyChats
              open={open}
              setOpen={setOpen}
              showsection={showsection}
              showchat={showchat}
              showprofile={showprofile}
              setshowprofile={setshowprofile}
              setshowchat={setshowchat}
              showleftbar={showleftbar}
            />
          )}

          {isMobile ? (
            showchat && (
              <ChatSection
                leftbar={leftbar}
                showleftbar={showleftbar}
                showchat={showchat}
                setshowchat={setshowchat}
              />
            )
          ) : (
            !showchat && (
              <ChatSection leftbar={leftbar} showleftbar={showleftbar} />
            )
          )}

          <Slider
            open={open}
            setOpen={setOpen}
            showsection={showsection}
            showchat={showchat}
          />
          <ProfileSection  open={open}
            setOpen={setOpen} showprofile={showprofile} setshowprofile={setshowprofile}
              />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
