import { Button } from "@/components/ui/button";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatState } from "@/Context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

function Groupchat({ setIsOpen }) {
 
  const [groupchatname, setgroupchatname] = useState("");
  const [selectedusers, setselectedusers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresults, setsearchresults] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const removeUser = (userId) => {
    setselectedusers(selectedusers.filter((user) => user._id !== userId));
  };

  const handlesearch = async (query) => {
    setsearch(query);
    if (!query) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://mern-chat-app-5-lyff.onrender.com/api/user?search=${search}`,
        config
      );
      setsearchresults(data);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setloading(false);
    }
  };

  const handlegroup = (add) => {
    if (selectedusers.includes(add)) {
      alert("already there");
      return;
    }
    setselectedusers([...selectedusers, add]);
  };

  const handlesubmit = async () => {
    if (!groupchatname || selectedusers.length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {       
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "https://mern-chat-app-5-lyff.onrender.com/api/chat/group",
        {
          name: groupchatname,
          users: JSON.stringify(selectedusers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);  // Close dialog after successful group creation
      alert("Group created");
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  return (
    <Dialog open onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>Create group with one single click</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected Users */}
          <div className="flex flex-wrap gap-3">
            {selectedusers.map((user) => {
              return (
                <div key={user._id} className="flex items-center gap-2">
                  <Badge className="py-1">{user.name}</Badge>
                  <X
                    onClick={() => removeUser(user._id)}
                    className="w-4 h-4 text-white bg-black cursor-pointer rounded-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Group Chat Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group-name" className="text-right">
              Name
            </Label>
            <Input
              id="group-name"
              value={groupchatname}
              onChange={(e) => setgroupchatname(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Add Users */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Add Users
            </Label>
            <Input
              id="username"
              value={search}
              onChange={(e) => handlesearch(e.target.value)}
              className="col-span-3"
              placeholder="Search users..."
            />
          </div>

          {/* Search Results */}
          <div className="mt-4">
            {loading ? (
              <div className="h-[7rem] w-full rounded-md border flex items-center justify-center">
                Loading...
              </div>
            ) : (
              searchresults.length > 0 && (
                <ScrollArea className="h-[7rem] w-full rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">Users</h4>
                    {searchresults.map((user) => (
                      <div key={user._id}>
                        <div
                          onClick={() => handlegroup(user)}
                          className="flex items-center bg-gray-200 hover:bg-green-600 hover:text-white cursor-pointer rounded-sm p-2 mb-2"
                        >
                          <img
                            src={user.pic}
                            className="w-[2rem] h-[2rem] rounded-full"
                            alt="user"
                          />
                          <div className="ml-3">
                            <div>{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex justify-between">
          <Button onClick={handlesubmit} className="w-1/2 bg-green-600 hover:bg-green-700">
            Create Group
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-1/2">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Groupchat;
