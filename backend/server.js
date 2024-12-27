const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
dotenv.config();
const bodyParser = require('body-parser');

const registerRoutes = require('./routes/register');
const otpRoutes = require('./routes/sendotp');
const chatroute = require('./routes/chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/register', registerRoutes);
app.use('/send-otp', otpRoutes);
app.use('/api/chat',chatroute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
