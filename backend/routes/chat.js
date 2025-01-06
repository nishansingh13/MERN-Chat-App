const express = require('express');
const router = express.Router();
const chats = require('../data/data');
router.get('/',(req,res)=>{
    res.json(chats);
})
router.get('/:id',(req,res)=>{
    // console.log(req.params.id);
    const singlechat = chats.find((c)=>c._id===req.params.id);
    res.send(singlechat);
})


module.exports = router;

