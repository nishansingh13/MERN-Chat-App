/**
 * Chat header component with user info and navigation
 */

import { ArrowLeftIcon } from "lucide-react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { getChatDisplayInfo } from "@/utils/chatUtils";
import group from "../../assets/group.jpg";

export function ChatHeader({ 
  selectedChat, 
  currentUser, 
  darkTheme, 
  isMobile, 
  showchat, 
  setshowchat 
}) {
  const chatInfo = getChatDisplayInfo(selectedChat, currentUser);

  return (
    <div className={`${
      darkTheme 
        ? "bg-gray-800/90 border-gray-700" 
        : "bg-white/90 border-gray-200"
    } backdrop-blur-sm border-b shadow-lg px-4 sm:px-6 py-4 flex items-center justify-between`}>
      
      <div className="flex items-center gap-4">
        {/* Back Button for Mobile */}
        {isMobile && (
          <button
            onClick={() => setshowchat(!showchat)}
            className={`p-2 rounded-full ${
              darkTheme 
                ? "hover:bg-gray-700 text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            } transition-colors duration-200`}
          >
            <ArrowLeftIcon size={20} />
          </button>
        )}

        <Dialog>
          <DialogTrigger>
            <div className="relative group cursor-pointer">
              {!selectedChat.isGroupChat ? (
                <Avatar
                  src={chatInfo.pic}
                  name={chatInfo.name}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <img
                  src={group}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md group-hover:scale-105 transition-transform duration-200"
                  alt="Group"
                />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className={`${
            darkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-2xl shadow-2xl`}>
            <DialogHeader>
              <DialogTitle className={`${
                darkTheme ? "text-white" : "text-gray-900"
              } text-xl font-bold text-center`}>
                User Profile
              </DialogTitle>
              <DialogDescription className="text-center space-y-4">
                {!selectedChat.isGroupChat ? (
                  <Avatar
                    src={chatInfo.pic}
                    name={chatInfo.name}
                    alt="Profile"
                    className={`${
                      isMobile ? "w-32 h-32" : "w-40 h-40"
                    } rounded-full mx-auto object-cover border-4 ${
                      darkTheme ? "border-orange-500" : "border-emerald-500"
                    } shadow-2xl`}
                    size={isMobile ? 128 : 160}
                  />
                ) : (
                  <img
                    src={group}
                    className={`${
                      isMobile ? "w-32 h-32" : "w-40 h-40"
                    } rounded-full mx-auto object-cover border-4 ${
                      darkTheme ? "border-orange-500" : "border-emerald-500"
                    } shadow-2xl`}
                    alt="Group"
                  />
                )}
                <div className={`${
                  darkTheme ? "text-gray-300" : "text-gray-700"
                } space-y-2`}>
                  <p className="text-lg font-semibold">
                    {!selectedChat.isGroupChat ? chatInfo.name : chatInfo}
                  </p>
                  {!selectedChat.isGroupChat && (
                    <p className="text-sm">
                      <span className="font-medium">Email: </span>
                      {chatInfo?.email}
                    </p>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Chat Name and Status */}
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-bold truncate ${
            darkTheme ? "text-white" : "text-gray-900"
          }`}>
            {!selectedChat.isGroupChat ? chatInfo.name : chatInfo}
          </h2>
          <p className={`text-sm ${
            darkTheme ? "text-gray-400" : "text-gray-500"
          }`}>
            {selectedChat.isGroupChat ? `${selectedChat.users.length} members` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

ChatHeader.propTypes = {
  selectedChat: PropTypes.shape({
    _id: PropTypes.string,
    chatName: PropTypes.string,
    isGroupChat: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      pic: PropTypes.string,
    })),
  }).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    pic: PropTypes.string,
  }).isRequired,
  darkTheme: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  showchat: PropTypes.bool.isRequired,
  setshowchat: PropTypes.func.isRequired,
};
