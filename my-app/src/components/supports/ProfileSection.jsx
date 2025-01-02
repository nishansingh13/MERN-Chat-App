import {  X , LucideEdit2, Edit2, Check  } from "lucide-react";
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
  const { user, setSelectedChat, chats, setChats,setUser } = ChatState();
  const [updatedname,setupdatedname] = useState("");
  const [data, setdata] = useState([]);
  const [profilepic,setprofilepic] = useState("");
  const { toast } = useToast();
  const [loading, setloading] = useState(false);
  const [chatloading, setchatloading] = useState(false);
  const [nameupdating, setnameupdating] = useState("");
  const [email,setemail] = useState("");
  const[name,setname] = useState("");
    useEffect(()=>{
        if(user){
        setname(user.name);
        setprofilepic(user.pic)
        setemail(user.email);
        }
    })
    useEffect(()=>{
      console.log(updatedname);
    })
    const changename = async()=>{
        if(updatedname!="" && user._id){
          const id = user._id;
          const data = {id,updatedname};
          try{
             const res = await axios.put("http://192.168.1.9:5000/api/user/change-name",data);
             const updatedUser = { ...user, name: updatedname };
             if(res.status==200){
              setname(updatedname);
              setUser(updatedUser);
                toast({
                  title:"Username updated"
                },1000)
             }
        }catch(err){
          console.log(err);
        }
      }
        else{
          console.log("not working")

        }
    }
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
                          {!nameupdating &&
                            <div className="text-[80%] text-black">{name}</div>}
                            {nameupdating &&
                            <Input className="text-black outline-none border-gray-700 w-[70%] mx-auto" placeholder={"Edit your name here.."}  onChange={(e)=>setupdatedname(e.target.value)}/> }
                            <div className="relative right-5 text-black ">
                              {!nameupdating ?(
                              
                              <Edit2 className="p-1 bottom-1 relative cursor-pointer" onClick={()=>{setnameupdating(!nameupdating)}}/>
                              ) :(
                                    <Check className="p-1 bottom-0 relative right-1 cursor-pointer" style={{border:"none"}} size={30} onClick={()=>{setnameupdating(!nameupdating);changename();}}/>
                              )}

                            </div>
                            
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
