import { Calendar, Home, Inbox, Search, Settings, X , MessageSquare } from "lucide-react";
import { useState } from "react";
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

function Slider({ open, setOpen }) {
  const { user, setSelectedChat, chats, setChats ,darkTheme } = ChatState();
  const [data, setdata] = useState([]);

  const { toast } = useToast();
  const [loading, setloading] = useState(false);
  const [chatloading, setchatloading] = useState(false);
  const [search, setsearch] = useState("");

  const accesschat = async (userid) => {
    try {
      setchatloading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("https://mern-chat-app-fk6w.onrender.com/api/chat", { userid }, config);
      console.log(chats);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); // if chat exists
      setSelectedChat(data);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setchatloading(false);
    }
  };

  const handlesearch = async () => {
    if (!search) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter something to search.",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`https://mern-chat-app-fk6w.onrender.com/api/user?search=${search}`, config);
      setdata(data);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  return (
    <SidebarProvider className={`overflow-hidden ${!open && "hidden"} `}>
    <Sidebar
      open={open}
      onClose={() => setOpen(false)}
      className={`transition-all w-[25rem] o ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <SidebarContent className={`h-full overflow-hidden bg-[#1e1e1e]`}> {/* added overflow-hidden */}
        <SidebarGroup>
          <button
            onClick={() => setOpen(false)}
            className="relative left-[14rem]"
          >
            <X className="border border-black rounded-full relative left-[8.6rem] text-white bg-black bottom-1 my-2"/>
          </button>
          <SidebarGroupLabel className="text-[1rem] text-black">
            <div className="flex w-full max-w-sm items-center space-x-2 mb-2">
              <Input
                type="Search Users"
                placeholder="Search Users"
                className={`${darkTheme &&"bg-[#343434] text-white border-orange-500"}`}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button type="submit" onClick={handlesearch}>Go</Button>
            </div>
          </SidebarGroupLabel>
          {!loading ? (
            <SidebarGroupContent className="h-[calc(100vh-4rem)] overflow-y-auto mt-2"> {/* restricted height and added overflow-y-auto */}
              <ScrollArea className="h-full w-full">
                <SidebarMenu>
                  {data.length ? (
                    data.map((item) => (
                      <SidebarMenuItem key={item._id} className="py-1" onClick={() => accesschat(item._id)} >
                        <div className={`${darkTheme?"bg-[#2d2d2d] text-white py-2 hover:bg-[#3d3d3d] ":"bg-gray-200 hover:bg-green-300"} rounded-xl  flex gap-2 p-1  cursor-pointer`}>
                          <img src={item.pic} className="w-[2rem] h-[2rem] rounded-full" />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-[0.64rem]">Email: {item.email}</div>
                          </div>
                        </div>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="text-[1.2rem] p-[1.5rem] font-bold">No Users found</div>
                  )}
                </SidebarMenu>
              </ScrollArea>
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

export default Slider;
