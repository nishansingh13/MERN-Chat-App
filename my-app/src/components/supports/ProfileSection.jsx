import { X, Edit2, Check, Loader2, User, Mail, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ChatState } from "@/Context/ChatProvider";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import PropTypes from "prop-types";

function ProfileSection({ showprofile, setshowprofile }) {
  const { user, setUser, darkTheme } = ChatState();
  const [updatedname, setupdatedname] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const { toast } = useToast();
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
              "https://chatify-backend-vpg6.onrender.com/api/user/change-profile",
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

  // Change name logic
  const changename = async () => {
    if (updatedname !== "" && user._id) {
      const id = user._id;
      const data = { id, updatedname };
      try {
        const res = await axios.put(
          "https://chatify-backend-vpg6.onrender.com/api/user/change-name",
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
    <div className={`${!showprofile && "hidden"} fixed inset-0 z-50`}>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setshowprofile(false)}
      />
      
      {/* Profile Panel */}
      <div className={`${
        showprofile ? 'translate-x-0' : '-translate-x-full'
      } fixed left-0 top-0 bottom-0 w-96 ${
        darkTheme 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      } shadow-2xl transition-transform duration-300 ease-in-out flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div className={`${
          darkTheme 
            ? "bg-gray-800/90 border-gray-700" 
            : "bg-white/90 border-gray-200"
        } backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${
            darkTheme ? "text-white" : "text-gray-900"
          }`}>
            Profile Settings
          </h2>
          <button
            onClick={() => setshowprofile(false)}
            className={`p-2 rounded-full ${
              darkTheme 
                ? "hover:bg-gray-700 text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            } transition-colors duration-200`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Profile Picture Section */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              {!profileloading ? (
                <div className="relative group">
                  <Avatar
                    src={profilepic}
                    name={name}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-200"
                    size={150}
                  />
                  <label 
                    htmlFor="file-input" 
                    className={`absolute inset-0 rounded-full cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      darkTheme ? "bg-black/50" : "bg-white/50"
                    } backdrop-blur-sm`}
                  >
                    <div className={`p-3 rounded-full ${
                      darkTheme 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "bg-emerald-600 hover:bg-emerald-700"
                    } text-white shadow-lg`}>
                      <Camera size={24} />
                    </div>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${
                  darkTheme ? "bg-gray-700" : "bg-gray-200"
                } border-4 border-white shadow-2xl`}>
                  <Loader2 className={`animate-spin ${
                    darkTheme ? "text-orange-500" : "text-emerald-600"
                  }`} size={40} />
                </div>
              )}
            </div>
            <p className={`text-sm ${
              darkTheme ? "text-gray-400" : "text-gray-600"
            }`}>
              Click on your avatar to change your profile picture
            </p>
          </div>

          {/* Name Section */}
          <div className={`${
            darkTheme 
              ? "bg-gray-800/50 border border-gray-700" 
              : "bg-white/80 border border-gray-200"
          } backdrop-blur-sm rounded-2xl p-6 space-y-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                darkTheme 
                  ? "bg-orange-600/20 text-orange-400" 
                  : "bg-emerald-600/20 text-emerald-600"
              }`}>
                <User size={20} />
              </div>
              <h3 className={`text-lg font-semibold ${
                darkTheme ? "text-white" : "text-gray-900"
              }`}>
                Display Name
              </h3>
            </div>
            
            <div className="space-y-3">
              {!nameupdating ? (
                <div className="flex items-center justify-between">
                  <p className={`text-lg ${
                    darkTheme ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {name}
                  </p>
                  <Button
                    onClick={() => setnameupdating(true)}
                    variant="ghost"
                    size="sm"
                    className={`${
                      darkTheme 
                        ? "hover:bg-gray-700 text-gray-300" 
                        : "hover:bg-gray-100 text-gray-600"
                    } transition-colors duration-200`}
                  >
                    <Edit2 size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Input
                    className={`flex-1 ${
                      darkTheme 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500/20" 
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-emerald-500/20"
                    } rounded-xl focus:ring-2 transition-all duration-200`}
                    placeholder="Enter your new name"
                    value={updatedname}
                    onChange={(e) => setupdatedname(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setnameupdating(false);
                        changename();
                      }}
                      size="sm"
                      className={`${
                        darkTheme 
                          ? "bg-orange-600 hover:bg-orange-700" 
                          : "bg-emerald-600 hover:bg-emerald-700"
                      } text-white`}
                    >
                      <Check size={16} />
                    </Button>
                    <Button
                      onClick={() => {
                        setnameupdating(false);
                        setupdatedname("");
                      }}
                      variant="ghost"
                      size="sm"
                      className={`${
                        darkTheme 
                          ? "hover:bg-gray-700 text-gray-300" 
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className={`${
            darkTheme 
              ? "bg-gray-800/50 border border-gray-700" 
              : "bg-white/80 border border-gray-200"
          } backdrop-blur-sm rounded-2xl p-6 space-y-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                darkTheme 
                  ? "bg-orange-600/20 text-orange-400" 
                  : "bg-emerald-600/20 text-emerald-600"
              }`}>
                <Mail size={20} />
              </div>
              <h3 className={`text-lg font-semibold ${
                darkTheme ? "text-white" : "text-gray-900"
              }`}>
                Email Address
              </h3>
            </div>
            
            <p className={`text-lg ${
              darkTheme ? "text-gray-300" : "text-gray-700"
            }`}>
              {email}
            </p>
            <p className={`text-sm ${
              darkTheme ? "text-gray-500" : "text-gray-500"
            }`}>
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfileSection.propTypes = {
  showprofile: PropTypes.bool.isRequired,
  setshowprofile: PropTypes.func.isRequired,
};

export default ProfileSection;
