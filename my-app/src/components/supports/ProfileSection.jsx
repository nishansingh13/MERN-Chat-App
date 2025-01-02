import {  X , LucideEdit2, Edit2  } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SkeletonDemo } from "./Skeleton";
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ChatState } from "@/Context/ChatProvider";
import { ScrollArea } from "@/components/ui/scroll-area"; 

function ProfileSection({  showprofile,setshowprofile}) {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [data, setdata] = useState([]);
  const [profilepic,setprofilepic] = useState("");
  const { toast } = useToast();
  const [loading, setloading] = useState(false);
  const [chatloading, setchatloading] = useState(false);
  const [search, setsearch] = useState("");
  const [email,setemail] = useState("");
  const[name,setname] = useState("");
    useEffect(()=>{
        if(user){
        setname(user.name);
        setprofilepic(user.pic)
        setemail(user.email);
        }
    })

  return (
    <SidebarProvider className={`overflow-hidden ${!showprofile && "hidden"} `}>
    <Sidebar
      open={showprofile}
      onClose={() => setshowprofile(!showprofile)}
      className={`transition-all w-[25rem]  ${showprofile ? "translate-x-0" : "-translate-x-full"}`}
    >
      <SidebarContent className="h-full overflow-hidden"> {/* added overflow-hidden */}
      
        <SidebarGroup>
          <button
            onClick={() => setshowprofile(!showprofile)}
            className="relative left-[14rem]"
          >
            <X  className="border border-black rounded-full relative left-[8.6rem] text-white bg-black bottom-1 my-2"/>
          </button>
          <SidebarMenuItem className="list-none text-[1.6rem] font-semibold">Profile</SidebarMenuItem>
         
          {!loading ? (
            <SidebarGroupContent className="h-[calc(100vh-4rem)] overflow-y-auto"> {/* restricted height and added overflow-y-auto */}
                <SidebarMenu>
                    
                    <SidebarMenuItem className="w-full">
                        <div className="flex justify-center">
                        <img src={profilepic} alt="" className="rounded-full w-[40%]" />
                        </div>
    
                    </SidebarMenuItem>
                    <SidebarMenu className="text-green-600 text-[1.1rem] relative left-5 top-8">
                    <div className=" relative my-2 ">Your name</div>
                        <div className="flex justify-between ">
                        
                            <div className="text-[80%] text-black">{name}</div>
                            <div className="relative right-5 text-black "><Edit2 className="p-1 bottom-1 relative"/></div>
                            
                            </div>
                            
                        
                    </SidebarMenu>
                    <SidebarMenu className="text-green-600 text-[1.1rem] relative left-5 top-8">
                    <div className=" relative my-2 ">Your email</div>
                        <div className="flex justify-between ">
                        
                            <div className="text-[80%] text-black">{email}</div>
                            
                            </div>
                            
                        
                    </SidebarMenu>
                </SidebarMenu>

              
            </SidebarGroupContent>
          ) : (
            <div>
              <SkeletonDemo />
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
  
  );
}

export default ProfileSection;
