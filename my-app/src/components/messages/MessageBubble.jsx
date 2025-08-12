/**
 * Individual message bubble component
 */

import { CheckCheck, ArrowDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { convertToIST } from '@/utils/dateUtils';
import { 
  isImageContent, 
  isVideoContent, 
  isFileContent, 
  extractFilename 
} from '@/utils/fileUtils';
import {
  getMessageBubbleStyles,
  getMessageBorderRadius,
  shouldShowAvatar
} from '@/utils/chatUtils';

export function MessageBubble({ 
  message, 
  index, 
  messages, 
  currentUser, 
  selectedChat, 
  darkTheme, 
  onDeleteMessage 
}) {
  const isOwn = message.sender._id === currentUser._id;
  const showAvatar = shouldShowAvatar(selectedChat, message, currentUser, index, messages);

  const renderMessageContent = () => {
    const { content } = message;

    if (isImageContent(content)) {
      return (
        <Dialog>
          <DialogTrigger>
            <img 
              src={content} 
              alt="Shared image" 
              className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200" 
            />
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img 
              src={content} 
              alt="Shared image" 
              className="w-full h-auto rounded-lg" 
            />
          </DialogContent>
        </Dialog>
      );
    }

    if (isVideoContent(content)) {
      return (
        <video 
          src={content} 
          controls 
          className="max-w-full h-40 rounded-lg"
        />
      );
    }

    if (isFileContent(content)) {
      return (
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
            isOwn 
              ? "bg-white/20 hover:bg-white/30" 
              : "bg-gray-100 hover:bg-gray-200"
          } transition-colors duration-200`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z"/>
          </svg>
          <span className="text-sm font-medium">
            {extractFilename(content)}
          </span>
        </a>
      );
    }

    return (
      <p className="text-sm leading-relaxed break-words">
        {content}
      </p>
    );
  };

  return (
    <div className="space-y-2">
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}>
        {/* Avatar for group chats */}
        {showAvatar && (
          <Avatar
            src={message.sender.pic}
            name={message.sender.name}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            size={32}
          />
        )}
        
        <div 
          className={getMessageBubbleStyles(isOwn, darkTheme)}
          style={getMessageBorderRadius(isOwn)}
        >
          {/* Delete Button for Own Messages */}
          {isOwn && (
            <button
              onClick={() => onDeleteMessage(message._id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              title="Delete message"
            >
              <ArrowDown size={12} />
            </button>
          )}

          {/* Group Chat Sender Name */}
          {selectedChat.isGroupChat && !isOwn && (
            <p className={`text-xs font-medium mb-1 ${
              darkTheme ? "text-orange-300" : "text-emerald-600"
            }`}>
              {message.sender.name}
            </p>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            {renderMessageContent()}

            {/* Message Info */}
            <div className={`flex items-center justify-end gap-1 text-xs mt-2 ${
              isOwn 
                ? "text-white/70" 
                : darkTheme 
                  ? "text-gray-400" 
                  : "text-gray-500"
            }`}>
              <span>{convertToIST(message.createdAt)}</span>
              {isOwn && (
                <CheckCheck 
                  size={16} 
                  className={`${
                    message.read ? "text-blue-300" : "text-white/50"
                  } transition-colors duration-200`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string,
    sender: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      pic: PropTypes.string,
    }).isRequired,
    chat: PropTypes.shape({
      _id: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    read: PropTypes.bool,
    file: PropTypes.shape({
      filename: PropTypes.string,
      mimetype: PropTypes.string,
      size: PropTypes.number,
    }),
  }).isRequired,
  index: PropTypes.number.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    pic: PropTypes.string,
  }).isRequired,
  selectedChat: PropTypes.shape({
    _id: PropTypes.string,
    isGroupChat: PropTypes.bool,
  }).isRequired,
  darkTheme: PropTypes.bool.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
};
