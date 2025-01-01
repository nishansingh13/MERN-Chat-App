import React, { useEffect, useState } from "react";
import DropDown from "@/components/supports/DropDown";
import AppSidebar from "@/components/supports/AppSidebar";
import { ChatState } from "@/Context/ChatProvider";
import MyChats from "@/components/MyChats";
import { LogOut, MessageCircle, MessageSquareMoreIcon, Search, User2 } from "lucide-react";
import Slider from "@/components/supports/Slider";
import ChatBox from "@/components/ChatBox";
import ChatSection from "@/components/ChatSection";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const { user } = ChatState();
  const [showsection, setshowsection] = useState(true);
  const [open, setOpen] = useState(false);
  const [showchat, setshowchat] = useState(false);
  const [leftbar, showleftbar] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const navigate = useNavigate();
const logout = ()=>{
  navigate("/");
      localStorage.removeItem("userInfo");

}
  return (
    <div className={``}>
    <div className="h-[41.5rem] md:h-lvh overflow-hidden">
      <div
        className={`fixed bg-[#2E2E2E] w-[5rem] h-[100%]  ${leftbar ? "hidden" : ""} ${isMobile?"hidden":""} flex flex-col justify-between`}
      >
        <div>
          <div>
            <MessageSquareMoreIcon
              className="w-8 h-8 text-green-400 m-5"
              onClick={() => showleftbar(!leftbar)}
            />
          </div>
          <div>
            <User2 className="text-white border border-black w-8 h-8 p-1 rounded-full bg-black mx-5 my-[3rem]" />
          </div>
          <div>
            <MessageCircle
              className="cursor-pointer text-white w-8 h-8 p-1 m-5"
              onClick={() => setshowchat(!showchat)}
            />
          </div>
        </div>
        <div>
          <LogOut className="text-white m-5 cursor-pointer" onClick={logout} />
        </div>
      </div>

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
        showchat && <ChatSection leftbar={leftbar} showleftbar={showleftbar} />
      ) : (
        !showchat && <ChatSection leftbar={leftbar} showleftbar={showleftbar} />
      )}

      <Slider open={open} setOpen={setOpen} showsection={showsection} showchat={showchat} />
    </div>
    </div>
  );
}

export default ChatPage;
