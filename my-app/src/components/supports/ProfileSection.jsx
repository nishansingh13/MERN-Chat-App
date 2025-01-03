import { X, LucideEdit2, Edit2, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SkeletonDemo } from "./Skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ChatState } from "@/Context/ChatProvider";
import { useMediaQuery } from "react-responsive";
import { Label } from "../ui/label";

function ProfileSection({ showprofile, setshowprofile }) {
  const { user, setUser } = ChatState();
  const [updatedname, setupdatedname] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const { toast } = useToast();
  const [loading, setloading] = useState(false);
  const [nameupdating, setnameupdating] = useState("");
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [profileloading, setprofileloading] = useState("");
  

  useEffect(() => {
    if (user) {
      setname(user.name);
      setprofilepic(user.pic);
      setemail(user.email);
    }
  }, [user]); // This hook will run every time the user state is updated

  // Update profile picture
  const updateprofile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "dqsx8yzbs");

    try {
      setprofileloading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqsx8yzbs/image/upload",
        data
      );

      console.log("Cloudinary upload successful:", response.data);

      if (response.status === 200) {
        const uploadedImageLink = response.data.secure_url;

        if (user._id && uploadedImageLink) {
          const updateData = { id: user._id, imagelink: uploadedImageLink };

          try {
            const res = await axios.put(
              "http://192.168.1.9:5000/api/user/change-profile",
              updateData
            );

            if (res.status === 200) {
              console.log("Profile updated successfully:", res.data);

              // Update the global state with the new user data (including pic)
              const updatedUser = { ...user, pic: uploadedImageLink };
              setUser(updatedUser);  // This should trigger a re-render
              toast({
                title: "Profile updated",
              });
            } else {
              console.error("Error updating profile:", res);
            }
          } catch (err) {
            console.error("Error sending PUT request:", err);
          }
        }
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
    finally{
      setprofileloading(false);
    }
  };

  // Handle image change (file input)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateprofile(file);
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width:768px)" });

  // Change name logic
  const changename = async () => {
    if (updatedname !== "" && user._id) {
      const id = user._id;
      const data = { id, updatedname };
      try {
        const res = await axios.put(
          "http://192.168.1.9:5000/api/user/change-name",
          data
        );
        const updatedUser = { ...user, name: updatedname };
        if (res.status === 200) {
          setname(updatedname);
          setUser(updatedUser); // Update user globally
          toast({
            title: "Username updated",
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Name update failed.");
    }
  };

  return (
    <SidebarProvider className={`overflow-hidden ${!showprofile && "hidden"}`}>
      <Sidebar
        open={showprofile}
        onClose={() => setshowprofile(!showprofile)}
        className={`transition-all w-[25rem] ${showprofile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent className="h-full overflow-hidden">
          <SidebarGroup>
            <button
              onClick={() => setshowprofile(!showprofile)}
              className="relative left-[14rem]"
            >
              <X className="border border-black rounded-full relative left-[8.6rem] text-white bg-black bottom-1 my-2" />
            </button>
            <SidebarMenuItem className="list-none text-[1.6rem] font-semibold">Profile</SidebarMenuItem>

            {!loading ? (
              <SidebarGroupContent className="h-[calc(100vh-4rem)] overflow-y-auto">
                <SidebarMenu>
                  {!profileloading?(
                  <SidebarMenuItem className="w-full">
                    <div className="flex justify-center flex-col items-center ">
                    <label htmlFor="file-input" className="relative cursor-pointer">
                      <img
                        src={profilepic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                        alt="Profile Picture"
                        className="rounded-full mx-auto w-[8rem] h-[8rem]"
                      />
                      </label>
                       <input
                              id="file-input"
                              type="file"
                              className="hidden"
                              onChange={handleImageChange} // Trigger file selection when image is clicked
                            />
                      <div>
                        
                      </div>
                    </div>
                  </SidebarMenuItem>):(
                    <div className="mx-auto">
                    <Loader2 className="animate-spin text-green-600" size={30}/>
                    </div>
                    )}
                  <SidebarMenu className="text-green-600 text-[1.1rem] relative left-5 top-8">
                    <div className="my-2">Your name</div>
                    <div className="flex justify-between">
                      {!nameupdating && <div className="text-[80%] text-black">{name}</div>}
                      {nameupdating && (
                        <Input
                          className="text-black outline-none border-gray-700 w-[70%] mx-auto"
                          placeholder="Edit your name here.."
                          onChange={(e) => setupdatedname(e.target.value)}
                        />
                      )}
                      <div className="relative right-5 text-black">
                        {!nameupdating ? (
                          <Edit2 className="p-1 bottom-1 relative cursor-pointer" onClick={() => setnameupdating(!nameupdating)} />
                        ) : (
                          <Check
                            className="p-1 bottom-0 relative right-1 cursor-pointer"
                            size={30}
                            onClick={() => {
                              setnameupdating(!nameupdating);
                              changename();
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </SidebarMenu>
                  <SidebarMenu className="text-green-600 text-[1.1rem] relative left-5 top-8">
                    <div className="my-2">Your email</div>
                    <div className="flex justify-between">
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
