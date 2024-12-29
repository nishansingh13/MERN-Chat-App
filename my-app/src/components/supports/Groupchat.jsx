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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatState } from "@/Context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

function Groupchat() {
  const [groupchatname, setgroupchatname] = useState("");
  const [selectedusers, setselectedusers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresults, setsearchresults] = useState([]);
  const [loading, setloading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);  // Track dialog open/close state
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
        `http://localhost:5000/api/user?search=${search}`,
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
        "http://localhost:5000/api/chat/group",
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="relative left-[70%] my-2">Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>Create group with one single click</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="mx-auto flex gap-5">
            {selectedusers.map((user) => {
              return (
                <div key={user._id}>
                  <div className="gap-4">
                    <Badge className="py-1">{user.name}</Badge>
                    <X
                      onClick={() => removeUser(user._id)}
                      className="relative bottom-[2rem] left-[93%] w-4 h-4 text-white border border-black rounded-full bg-black cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue=""
              className="col-span-3"
              onChange={(e) => setgroupchatname(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Add Users
            </Label>
            <Input
              id="username"
              onChange={(e) => handlesearch(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="mx-auto">
            {loading ? (
              <div className="h-[7rem] w-[19rem] rounded-md border mx-auto">
                Loading...
              </div>
            ) : (
              searchresults.length > 0 && (
                <ScrollArea className="h-[7rem] w-[19rem] rounded-md border ml-[rem]">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">USERS</h4>
                    {searchresults.map((user) => (
                      <div key={user._id}>
                        <div
                          onClick={() => handlegroup(user)}
                          className="text-sm flex bg-gray-300 w-[90%] cursor-pointer hover:bg-green-300 rounded-sm"
                        >
                          <img
                            src={user.pic}
                            className="w-[1.5rem] h-[1.5rem] rounded-full m-2"
                          />
                          <div>
                            <div> {user.name} </div>
                            <div className="text-[0.75rem]">{user.email}</div>
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handlesubmit}>
            Save changes
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Groupchat;
