/**
 * Typing indicator component
 */

import Lottie from "lottie-react";
import PropTypes from "prop-types";
import typinganimation from "../../assets/typing_animation.json";

export function TypingIndicator({ darkTheme }) {
  return (
    <div className="flex justify-start">
      <div className={`${
        darkTheme ? "bg-gray-700" : "bg-white border border-gray-200"
      } rounded-2xl px-4 py-3 shadow-lg`}>
        <Lottie
          animationData={typinganimation}
          loop={true}
          autoplay={true}
          className="w-12 h-8"
        />
      </div>
    </div>
  );
}

TypingIndicator.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
};
