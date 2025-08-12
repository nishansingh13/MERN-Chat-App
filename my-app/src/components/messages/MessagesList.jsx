/**
 * Messages list container component
 */

import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function MessagesList({ 
  messages, 
  currentUser, 
  selectedChat, 
  darkTheme, 
  isTyping, 
  onDeleteMessage, 
  scrollRef 
}) {
  return (
    <div className="flex-1 overflow-hidden">
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        ref={scrollRef}
        className="h-full"
      >
        <div className="p-4 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message._id}
              message={message}
              index={index}
              messages={messages}
              currentUser={currentUser}
              selectedChat={selectedChat}
              darkTheme={darkTheme}
              onDeleteMessage={onDeleteMessage}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator darkTheme={darkTheme} />}
        </div>
      </Scrollbars>
    </div>
  );
}

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string,
    sender: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      pic: PropTypes.string,
    }),
    chat: PropTypes.shape({
      _id: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    file: PropTypes.shape({
      filename: PropTypes.string,
      mimetype: PropTypes.string,
      size: PropTypes.number,
    }),
  })).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    pic: PropTypes.string,
  }).isRequired,
  selectedChat: PropTypes.shape({
    _id: PropTypes.string,
    isGroupChat: PropTypes.bool,
  }).isRequired,
  darkTheme: PropTypes.bool.isRequired,
  isTyping: PropTypes.bool.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  scrollRef: PropTypes.object.isRequired,
};
