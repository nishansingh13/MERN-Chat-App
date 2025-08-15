import { Search, X, User, Mail, Loader2, Users } from "lucide-react";
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
import { Avatar } from "../ui/avatar"; 
import PropTypes from "prop-types";

function Slider({ open, setOpen }) {
  const { user, setSelectedChat, chats, setChats, darkTheme } = ChatState();
  const [data, setdata] = useState([]);
  const { toast } = useToast();
  const [loading, setloading] = useState(false);
  const [search, setsearch] = useState("");

  const accesschat = async (userid) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("https://chatify-backend-vpg6.onrender.com/api/chat", { userid }, config);
      console.log(chats);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); // if chat exists
      setSelectedChat(data);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to access chat. Please try again.",
      });
    } finally {
      setOpen(false);
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
      const { data } = await axios.get(`https://chatify-backend-vpg6.onrender.com/api/user?search=${search}`, config);
      setdata(data);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  return (
    <SidebarProvider className={`overflow-hidden ${!open && "hidden"}`}>
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        className={`transition-all duration-300 ease-in-out w-[28rem] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent 
          className={`h-full overflow-hidden ${
            darkTheme 
              ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
              : "bg-gradient-to-b from-gray-50 via-white to-gray-100"
          } backdrop-blur-sm`}
        >
          <SidebarGroup className="h-full flex flex-col">
            {/* Header */}
            <div className={`${
              darkTheme 
                ? "bg-gray-800/90 border-gray-700" 
                : "bg-white/90 border-gray-200"
            } backdrop-blur-sm border-b shadow-lg px-6 py-4 flex items-center justify-between flex-shrink-0`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  darkTheme 
                    ? "bg-gradient-to-r from-orange-600 to-amber-600" 
                    : "bg-gradient-to-r from-emerald-600 to-green-600"
                }`}>
                  <Users size={20} className="text-white" />
                </div>
                <h2 className={`text-xl font-bold ${
                  darkTheme ? "text-white" : "text-gray-900"
                }`}>
                  Find Users
                </h2>
              </div>
              
              <button
                onClick={() => setOpen(false)}
                className={`p-2 rounded-full ${
                  darkTheme 
                    ? "hover:bg-gray-700 text-gray-300 hover:text-white" 
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                } transition-all duration-200 hover:scale-105`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Section */}
            <div className="px-6 py-4 flex-shrink-0">
              <SidebarGroupLabel className="mb-3">
                <span className={`text-sm font-medium ${
                  darkTheme ? "text-gray-300" : "text-gray-700"
                }`}>
                  Search for users to start chatting
                </span>
              </SidebarGroupLabel>
              
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkTheme ? "text-gray-400" : "text-gray-500"
                  }`} size={18} />
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    className={`pl-10 rounded-xl border-none ${
                      darkTheme 
                        ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-orange-500/20" 
                        : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-emerald-500/20"
                    } focus:ring-2 transition-all duration-200`}
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlesearch()}
                  />
                </div>
                
                <Button 
                  onClick={handlesearch}
                  disabled={loading || !search.trim()}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                    darkTheme 
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700" 
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <SidebarGroupContent className="flex-1 px-6 pb-6 overflow-hidden">
              {loading ? (
                <div className="space-y-4">
                  <SkeletonDemo />
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-3">
                    {data.length > 0 ? (
                      <>
                        <p className={`text-sm font-medium ${
                          darkTheme ? "text-gray-400" : "text-gray-600"
                        } mb-4`}>
                          Found {data.length} user{data.length !== 1 ? 's' : ''}
                        </p>
                        
                        <SidebarMenu className="space-y-2">
                          {data.map((item) => (
                            <SidebarMenuItem 
                              key={item._id}
                              onClick={() => accesschat(item._id)}
                              className="cursor-pointer"
                            >
                              <div className={`${
                                darkTheme
                                  ? "bg-gray-800/50 hover:bg-gray-700/70 border-gray-700" 
                                  : "bg-white/80 hover:bg-gray-50 border-gray-200"
                              } backdrop-blur-sm border rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group`}>
                                <div className="flex items-center gap-4">
                                  {/* Avatar */}
                                  <div className="relative">
                                    <Avatar
                                      src={item.pic}
                                      name={item.name}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md group-hover:scale-105 transition-transform duration-200"
                                      size={48}
                                    />
                                  </div>
                                  
                                  {/* User Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <User size={14} className={`${
                                        darkTheme ? "text-orange-400" : "text-emerald-600"
                                      }`} />
                                      <h3 className={`font-semibold truncate ${
                                        darkTheme ? "text-white" : "text-gray-900"
                                      }`}>
                                        {item.name}
                                      </h3>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Mail size={12} className={`${
                                        darkTheme ? "text-gray-400" : "text-gray-500"
                                      }`} />
                                      <p className={`text-sm truncate ${
                                        darkTheme ? "text-gray-400" : "text-gray-600"
                                      }`}>
                                        {item.email}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Action Indicator */}
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    darkTheme 
                                      ? "bg-orange-600/20 text-orange-400" 
                                      : "bg-emerald-600/20 text-emerald-600"
                                  } group-hover:scale-110 transition-transform duration-200`}>
                                    <Search size={14} />
                                  </div>
                                </div>
                              </div>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </>
                    ) : search.trim() ? (
                      <div className="text-center py-12">
                        <div className={`inline-flex items-center gap-3 p-6 rounded-2xl ${
                          darkTheme 
                            ? "bg-gray-800/50 border border-gray-700" 
                            : "bg-white/80 border border-gray-200"
                        } backdrop-blur-sm shadow-lg`}>
                          <Users size={24} className={`${
                            darkTheme ? "text-gray-400" : "text-gray-500"
                          }`} />
                          <div>
                            <h3 className={`font-semibold ${
                              darkTheme ? "text-white" : "text-gray-900"
                            }`}>
                              No users found
                            </h3>
                            <p className={`text-sm ${
                              darkTheme ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Try searching with different keywords
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className={`inline-flex items-center gap-3 p-6 rounded-2xl ${
                          darkTheme 
                            ? "bg-gray-800/50 border border-gray-700" 
                            : "bg-white/80 border border-gray-200"
                        } backdrop-blur-sm shadow-lg`}>
                          <Search size={24} className={`${
                            darkTheme ? "text-orange-400" : "text-emerald-600"
                          }`} />
                          <div>
                            <h3 className={`font-semibold ${
                              darkTheme ? "text-white" : "text-gray-900"
                            }`}>
                              Start searching
                            </h3>
                            <p className={`text-sm ${
                              darkTheme ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Enter a name or email to find users
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

Slider.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Slider;
