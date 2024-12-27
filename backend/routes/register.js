const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const datapath = path.join(__dirname, '../data.json');

// Fetch all registered users
router.get('/', (req, res) => {
  fs.readFile(datapath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading data file' });
    }
    res.json(JSON.parse(data));
  });
});

// Register a new user
router.post('/', (req, res) => {
  const { email, password, name } = req.body;
  const newUser = { email, password, name };

  fs.readFile(datapath, (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading data file' });

    const users = JSON.parse(data);
    const userExists = users.some(user => user.email === email);

    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    users.push(newUser);

    fs.writeFile(datapath, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save user data' });
      res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

module.exports = router;
