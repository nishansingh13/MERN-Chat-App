# Chatify - Real-Time Chat Application

A modern real-time chat application built with React, Node.js, Socket.IO, and MongoDB.

## Features

- Real-time messaging
- Video calling functionality
- User authentication with email verification
- Read receipts
- Typing indicators
- Emoji support
- Dark/Light theme
- Responsive design

## Tech Stack

### Frontend
- React.js
- Socket.IO Client
- Tailwind CSS
- Radix UI Components
- React Router

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <https://github.com/nishansingh13/MERN-Chat-App>
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../my-app
npm install
```

4. Configure Environment Variables
Create a .env file in the backend directory with:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Start the Application
```bash
# Start Backend
cd backend
npm run dev

# Start Frontend (in a new terminal)
cd my-app
npm run dev
```

## Features in Detail

- **Real-time Communication**: Implemented using Socket.IO for instant message delivery
- **Video Calling**: Peer-to-peer video calling functionality
- **Authentication**: Secure user authentication with email verification
- **Message Status**: Real-time read receipts and typing indicators
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
