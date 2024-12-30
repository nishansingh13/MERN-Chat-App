const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const User = require("./models/UserModel");
const colors = require("colors");
const sendotp = require("./routes/sendotp");
const userRoutes = require("./routes/userroutes");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const messageroutes = require("./routes/messageroutes");
dotenv.config();
connectDB();
const bodyParser = require('body-parser');

const chatroute = require('./routes/chatroutes');
const { Socket } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/send-otp",sendotp);

// Use routes

app.use("/api/chat",chatroute);
app.use("/api/message",messageroutes);
app.get("/",(req,res)=>{
  res.send("working");
})
app.use('/mdata',async(req,res)=>{
    const data = await User.find({});
    res.json(data);
})
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://192.168.1.9:${PORT}`.yellow.bold);
});
const io = require("socket.io")(server,{
  pingTimeout : 60000,
  cors:{
    origin : "http://192.168.1.9:5173"
  }
});
io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    socket.on('setup',(userdata)=>{
      socket.join(userdata._id);
      //here
      socket.emit("connected");
    })
    socket.on('join chat',(room)=>{
      socket.join(room);
      console.log("user room joind "+room);
    })
    socket.on("new message",(newmessage)=>{
      var chat = newmessage.chat;
      if(!chat.users) return console.log("chat.users not defined");
      chat.users.forEach(user=>{
        if(user._id == newmessage.sender._id) return;
        socket.in(user._id).emit("message received",newmessage);
      })
    })
});