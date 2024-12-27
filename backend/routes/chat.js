const express = require('express');
const router = express.Router();
const chats = require('../data/data');
console.log(chats)
;router.get('/',(req,res)=>{
    res.send(chats);
})
router.get('/:id',(req,res)=>{
    // console.log(req.params.id);
    const singlechat = chats.find((c)=>c._id===req.params.id);
    res.send(singlechat);
})


module.exports = router;

