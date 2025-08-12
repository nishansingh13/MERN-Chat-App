const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const User = require("./models/UserModel");
const colors = require("colors");
const sendotp = require("./routes/sendotp");
const userRoutes = require("./routes/userroutes");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const path = require('path');

const messageroutes = require("./routes/messageroutes");
dotenv.config();
connectDB();
const bodyParser = require('body-parser');

const chatroute = require('./routes/chatroutes');
const { Socket } = require('socket.io');
const Message = require('./models/messagemodel');

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.get("/api/ping", (req, res) => {
    res.send("Pong");
});
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/send-otp", sendotp);

// Use routes
app.use("/api/chat", chatroute);
app.use("/api/message", messageroutes);

app.use('/mdata', async (req, res) => {
    const data = await User.find({});
    res.json(data);
});

/*--------------------------------- DEPLOYMENT -------------------------*/

/*--------------------------------- DEPLOYMENT -------------------------*/
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on :${PORT}`.yellow.bold);
});
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*", // your frontend URL
        methods: ["GET", "POST"], // Specify allowed methods
        allowedHeaders: ["Content-Type"], // Specify allowed headers if needed
        credentials: true, // Allow credentials like cookies to be sent
    },
});


io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userdata) => {
        socket.join(userdata._id);
        socket.emit("connected");
    });

    socket.on('join chat', async (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    
        try {
            // Find all messages in the chat room
            const messages = await Message.find({ chat: room });
    
            // Mark each message as read
            messages.forEach(async (message) => {
                if (!message.read) {
                    message.read = true;
                    await message.save(); 
                    
                }
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    });
    socket.on('data sending',(data)=>{
        console.log(data);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newmessage) => {
        var chat = newmessage.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id === newmessage.sender._id) return;
            socket.in(user._id).emit("message received", newmessage);
        });
    });
    socket.on("message is read", async ({ messageId, chatId }) => {
        try {
          // Update the message's isRead status to true in the database
          const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { read: true },
            { new: true } // Return the updated document
          );
      
          // Emit back the updated message to the frontend
          io.to(chatId).emit("message read", updatedMessage);
        } catch (err) {
          console.error("Error updating message read status:", err);
        }
      });
  
  socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userdata._id);
    });
});
