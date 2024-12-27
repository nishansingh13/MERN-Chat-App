const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const colors = require("colors");
const userRoutes = require("./routes/userroutes");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const bodyParser = require('body-parser');

const chatroute = require('./routes/chat');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", userRoutes);

// Use routes

app.use('/api/chat',chatroute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.yellow.bold);
});
