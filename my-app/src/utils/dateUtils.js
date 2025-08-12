/**
 * Utility functions for date and time handling
 */

/**
 * Converts UTC timestamp to IST (Indian Standard Time)
 * @param {string} utcTimestamp - UTC timestamp string
 * @returns {string} Formatted IST time string
 */
export function convertToIST(utcTimestamp) {
  const utcDate = new Date(utcTimestamp);
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const istDate = utcDate.toLocaleString('en-IN', options);
  return istDate.replace(',', ''); // Remove the comma
}

/**
 * Formats date for message grouping (e.g., "Today", "Yesterday", "Jan 15")
 * @param {string} timestamp - Message timestamp
 * @returns {string} Formatted date string
 */
export function formatMessageDate(timestamp) {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return messageDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  }
}
