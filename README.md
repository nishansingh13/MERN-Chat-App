# Chatify

Chatify is a real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) with **Socket.IO** for instant messaging. It allows users to communicate seamlessly with features like authentication, message statuses, and media sharing.

## Features

- **Real-time Messaging** using Socket.IO
- **User Authentication** (Sign up, Login, Logout)
- **Message Read Status**
- **Image Uploads** with Cloudinary
- **Responsive UI** with Tailwind CSS
- **WebRTC Integration** (Planned for future updates)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, ShadCN (for UI components)
- **Backend:** Node.js, Express, MongoDB (Mongoose for ODM)
- **Real-time Communication:** Socket.IO
- **Authentication:** JWT (earlier) -> Moving to bcrypt-only authentication
- **Image Storage:** Cloudinary

## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js & npm
- MongoDB (local or Atlas for cloud storage)

### Clone the Repository
```sh
git clone https://github.com/your-username/chatify.git
cd chatify
```

### Backend Setup
1. Navigate to the server directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your environment variables:
   ```sh
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## Usage
- Sign up or log in to start chatting.
- Add contacts and send messages in real time.
- Upload and share images.

## Future Improvements
- WebRTC for voice & video calls
- Group chat functionality
- Message encryption
- Push notifications

## Contributing
Contributions are welcome! Feel free to fork the repo and submit pull requests.

## License
This project is licensed under the MIT License.

## Contact
For questions or suggestions, reach out via GitHub or email.

