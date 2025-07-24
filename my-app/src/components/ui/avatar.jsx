import { useState } from 'react';

export function Avatar({ src, alt, name, className, size = 150 }) {
  const [imageError, setImageError] = useState(false);
  
  const getDefaultAvatar = (userName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=6366f1&color=fff&size=${size}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <img
      src={imageError || !src ? getDefaultAvatar(name) : src}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}
