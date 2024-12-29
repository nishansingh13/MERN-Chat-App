import { Button } from "@/components/ui/button";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatState } from "@/Context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

function Groupchat() {
  const [groupchatname, setgroupchatname] = useState("");
  const [selectedusers, setselectedusers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresults, setsearchresults] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

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
      console.log(data);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setloading(false);
    }
  };

  const handlesubmit = async (query) => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>Create group with one single click</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
                Loading..
              </div>
            ) : (
              searchresults.length > 0 && (
                <ScrollArea className="h-[7rem] w-[19rem] rounded-md border ml-[rem]">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">USERS</h4>
                    {searchresults.map((user) => (
                      <>
                        <div
                          key={user._id}
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
                      </>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Groupchat;
