const express = require('express');
const router = express.Router();
const chats = require('../data/data');
router.get('/',(req,res)=>{
    res.send(chats);
})



module.exports = router;

