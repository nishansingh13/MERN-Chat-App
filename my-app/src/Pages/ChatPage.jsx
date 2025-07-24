import { useEffect, useState } from "react";
import { ChatState } from "@/Context/ChatProvider";
import MyChats from "@/components/MyChats";
import Slider from "@/components/supports/Slider";
import ChatSection from "@/components/ChatSection";
import { useMediaQuery } from "react-responsive";
import ProfileSection from "@/components/supports/ProfileSection";

function ChatPage() {
  const [showsection, setshowsection] = useState(false);
  const [open, setOpen] = useState(false);
  const [showprofile, setshowprofile] = useState(false);
  const [showchat, setshowchat] = useState(false);
  const { setDarkTheme, darkTheme } = ChatState();
  const [leftbar, showleftbar] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  
  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem("theme"));
    setDarkTheme(theme);
  }, [setDarkTheme]);

  return (
    <div className={`${!isMobile && `${darkTheme?"bg-orange-500":"bg-green-600"}`} ${isMobile && darkTheme && "bg-orange-500"} min-h-screen`}>
      <div className="scale-x-[98%] scale-y-[95%] rounded-2xl overflow-hidden">
        <div className="h-[41.5rem] md:h-lvh overflow-hidden relative">
          
          {/* Sidebar - Always show on desktop, conditionally on mobile */}
          {(!isMobile || !showchat) && (
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

          {/* Chat Section - Always show on desktop, conditionally on mobile */}
          {(!isMobile || showchat) && (
            <ChatSection
              showchat={showchat}
              setshowchat={setshowchat}
            />
          )}

          <Slider
            open={open}
            setOpen={setOpen}
            showsection={showsection}
            showchat={showchat}
          />
          <ProfileSection 
            open={open}
            setOpen={setOpen} 
            showprofile={showprofile} 
            setshowprofile={setshowprofile}
          />
        </div>
      </div>
    </div>
  );

}

export default ChatPage;
