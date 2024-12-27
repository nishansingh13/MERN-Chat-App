const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nishansingh2480@gmail.com',
    pass: 'qgylyefzuhuzhrnk',  
  },
});
const datapath = path.join(__dirname, 'data.json');
app.get('/register', (req, res) => {
  fs.readFile(datapath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data file' });
    }
    res.json(JSON.parse(data));
  });
});
app.post('/register', (req, res) => {
  const { email, password ,name } = req.body;
  const newUser = { email, password ,name};
  fs.readFile(datapath, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading data file' });
    const users = JSON.parse(data);
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    users.push(newUser);
    fs.writeFile(datapath, JSON.stringify(users, null, 3), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save user data' });
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const mailOptions = {
    from: 'nishansingh2480@gmail.com',
    to: email,
    subject: 'Your OTP for registration',
    text: `Your OTP for registration is: ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    res.json(otp);
    res.status(200).json({ message: 'OTP sent successfully to your email' });
  });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});