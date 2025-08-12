/**
 * Utility functions for file handling and Cloudinary uploads
 */

import axios from 'axios';

/**
 * Upload file to Cloudinary
 * @param {File} file - File to upload
 * @returns {Promise<string>} Secure URL of uploaded file
 */
export async function uploadToCloudinary(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ml_default");
  data.append("cloud_name", "dqsx8yzbs");

  const uploadUrl = getCloudinaryUploadUrl(file.type);
  
  const response = await axios.post(uploadUrl, data);
  
  if (response.status === 200) {
    return response.data.secure_url;
  }
  
  throw new Error('File upload failed');
}

/**
 * Get appropriate Cloudinary upload URL based on file type
 * @param {string} fileType - MIME type of the file
 * @returns {string} Cloudinary upload URL
 */
function getCloudinaryUploadUrl(fileType) {
  const baseUrl = "https://api.cloudinary.com/v1_1/dqsx8yzbs";
  
  if (fileType.startsWith("video/")) {
    return `${baseUrl}/video/upload`;
  } else if (fileType.startsWith("image/")) {
    return `${baseUrl}/image/upload`;
  } else {
    return `${baseUrl}/raw/upload`;
  }
}

/**
 * Check if content is a Cloudinary image URL
 * @param {string} content - Message content
 * @returns {boolean} True if it's an image URL
 */
export function isImageContent(content) {
  return content.includes("dqsx8yzbs/image/");
}

/**
 * Check if content is a Cloudinary video URL
 * @param {string} content - Message content
 * @returns {boolean} True if it's a video URL
 */
export function isVideoContent(content) {
  return content.includes("dqsx8yzbs/video/");
}

/**
 * Check if content is a Cloudinary file URL
 * @param {string} content - Message content
 * @returns {boolean} True if it's a file URL
 */
export function isFileContent(content) {
  return content.includes("dqsx8yzbs/raw/");
}

/**
 * Extract filename from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Extracted filename
 */
export function extractFilename(url) {
  return url.substring(url.lastIndexOf('/') + 1);
}
