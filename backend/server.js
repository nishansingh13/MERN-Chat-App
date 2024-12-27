const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const colors = require("colors");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const bodyParser = require('body-parser');

const chatroute = require('./routes/chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use routes

app.use('/api/chat',chatroute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.yellow.bold);
});
