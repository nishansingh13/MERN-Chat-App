/**
 * Loading screen component shown while messages are being fetched
 */

import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export function LoadingScreen({ darkTheme }) {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="text-center space-y-4">
        <Loader2 className={`animate-spin ${
          darkTheme ? "text-orange-500" : "text-emerald-600"
        } mx-auto`} size={60} />
        <p className={`text-lg font-medium ${
          darkTheme ? "text-gray-400" : "text-gray-600"
        }`}>
          Loading messages...
        </p>
      </div>
    </div>
  );
}

LoadingScreen.propTypes = {
  darkTheme: PropTypes.bool.isRequired,
};
