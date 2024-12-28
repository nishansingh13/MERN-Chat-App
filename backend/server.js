const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const User = require("./models/UserModel");
const colors = require("colors");
const sendotp = require("./routes/sendotp");
const userRoutes = require("./routes/userroutes");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
dotenv.config();
connectDB();
const bodyParser = require('body-parser');

const chatroute = require('./routes/chatroutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/send-otp",sendotp);

// Use routes

app.use("/api/chat",chatroute);

app.use('/mdata',async(req,res)=>{
    const data = await User.find({});
    res.json(data);
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.yellow.bold);
});
