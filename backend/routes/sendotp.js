const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nishansingh2480@gmail.com',
    pass: 'qgylyefzuhuzhrnk',
  },
});

router.post('/', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: 'nishansingh2480@gmail.com',
    to: email,
    subject: 'Your OTP for registration',
    text: `Your OTP for registration is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({ error: 'Something went wrong!!' });
    }
    res.status(200).json({message:otp});
  });
});

module.exports = router;
