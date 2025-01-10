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
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    console.log("Production mode: Serving static files");

    // Correct path to the `dist` folder located outside `backend`
    app.use(express.static(path.join(__dirname1, "../my-app/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, process.cwd(),"my-app","dist","index.html"));
    });
} else {
    console.log("Development mode: API is running");
    app.get("/", (req, res) => {
        res.send("API RUNNING");
    });
}
app.use("/ok",(req,res)=>{
    res.send("yeah u can do it");
})
/*--------------------------------- DEPLOYMENT -------------------------*/
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on :${PORT}`.yellow.bold);
});
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
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

  // Handle room join
  socket.on("join room", ({ email, room }) => {
    // console.log("User joined with ",email,room);
    emailToSocketIdMap.set(email, socket.id);
    socket.join(room);
    socketIdToEmailMap.set(socket.id, email);
    socket.broadcast.emit("user joined", { email, id: socket.id ,room});
    // socket.emit("user joined", { email, id: socket.id });
    io.to(socket.id).emit("room join", { email, room });
  });

  // Handle call
  socket.on("user call", ({ to, offer }) => {
    console.log("user called");
    io.to(to).emit("incoming call", { from: socket.id, offer });
  });
   
  // Handle call accepted
  socket.on("call accepted", ({ to, ans }) => {
    console.log("Call accepted");
    io.to(to).emit("call accepted", { from: socket.id, ans });
  });
  socket.on("call rejected",(userId)=>{
    console.log("call rejected by",userId);
    socket.broadcast.emit("call rejected by receiver",userId);
  })
  socket.on("stop call",()=>{
    io.emit("stop the call");
  })
  socket.on("call accepted by receiver",({email})=>{
    const data = {email, id:socket.id}
        socket.broadcast.emit("call accepted by receiver",data);
  })
  // Handle negotiation needed
  socket.on("nego needed", ({ to, offer }) => {
    io.to(to).emit("nego needed", { from: socket.id, offer });
  });

  // Handle peer negotiation done
  socket.on("peer nego done", ({ to, ans }) => {
    io.to(to).emit("peer nego final", { from: socket.id, ans }); // Corrected 'offer' to 'ans'
  });
  
  socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userdata._id);
    });
});
