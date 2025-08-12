/**
 * Welcome screen component shown when no chat is selected
 */

import { MessageSquareText } from "lucide-react";
import PropTypes from "prop-types";

export function WelcomeScreen({ darkTheme, isMobile }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className={`inline-flex items-center gap-4 p-6 rounded-2xl ${
          darkTheme 
            ? "bg-gray-800/50 border border-gray-700" 
            : "bg-white/80 border border-gray-200"
        } backdrop-blur-sm shadow-2xl`}>
          <div className={`p-4 rounded-full ${
            darkTheme 
              ? "bg-gradient-to-r from-orange-600 to-amber-600" 
              : "bg-gradient-to-r from-emerald-600 to-green-600"
          }`}>
            <MessageSquareText size={40} className="text-white" />
          </div>
          <div>
            <h1 className={`text-4xl font-bold ${
              darkTheme ? "text-white" : "text-gray-800"
            }`}>
              Chatify {!isMobile ? "Web" : ""}
            </h1>
            <p className={`text-lg ${
              darkTheme ? "text-orange-400" : "text-emerald-600"
            } font-medium`}>
              Responsive Chatting Web App
            </p>
          </div>
        </div>
        
        <p className={`text-lg ${
          darkTheme ? "text-gray-400" : "text-gray-600"
        } max-w-md mx-auto leading-relaxed`}>
          Select a conversation from the sidebar to start chatting with your friends and family.
        </p>
      </div>
    </div>
  );
}

WelcomeScreen.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};
