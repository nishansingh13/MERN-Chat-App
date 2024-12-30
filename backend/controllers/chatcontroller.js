const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatmodel");
const User = require("../models/UserModel");

// @description     Create or fetch a One-to-One Chat
// @route           POST /api/chat/
// @access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userid } = req.body; // Changed to match the input

  if (!userid) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // Find existing chat between the authenticated user and the target user
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userid } } },
    ],
  })
    .populate("users", "-password") // Populate users without passwords
    .populate("latestMessage"); // Populate latest message

  // Populate the sender of the latest message
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // If the chat already exists, return it
  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    // If no existing chat, create a new one
    const chatData = {
      chatName: "sender", // You can modify this as needed
      isGroupChat: false,
      users: [req.user._id, userid],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchchats = asyncHandler(async(req,res)=>{
    try{
        //.then((result)=>res.send(result));
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (result)=>{
          result = await User.populate(result,{
            path : "latestMessage.sender",
            select : "name pic email"
          })
          res.status(200).send(result);
        })

    }catch(err){
        res.status(400);
        throw new Error(err.message);
    }

})
const creategroupchat = asyncHandler(async(req,res)=>{
    if(!req.body.users|| !req.body.name){
      return res.status(400).send({message:"Please fill all the fields nigga"});
    }
      var users = JSON.parse(req.body.users);
      if(users.length<2){
        return res.status(400).send("More than 2 users are required to create a group");
      }
      users.push(req.user);
      try{
        const groupchat = await Chat.create({
          chatName: req.body.name,
          users : users,
          isGroupChat : true,
          groupAdmin : req.user
        })
        const fullgroupchat = await Chat.findOne({_id:groupchat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");
        res.status(200).send(fullgroupchat);
      }
      catch(err){
        res.status(400).send("Coudn't create group")
      } 
})
const renameGroup = asyncHandler(async(req,res)=>{
    const { chatid , chatName } = req.body;
    const updatechat = await Chat.findByIdAndUpdate(chatid,{
       chatName
    },
    {new:true}
  ).populate("users","-password")
  .populate("groupAdmin","-password")
  if(!updatechat){
    res.status(400)
    throw new Error("Chat not found");
  }
  else{
    res.json(updatechat);
  }
})
const addtogroup = asyncHandler(async(req,res)=>{
    const {chatid,userid} = req.body;
    const added = await Chat.findByIdAndUpdate(chatid,{
      $push : {users:userid},
    },
    {new :true}
  ).populate("users","-password")
  .populate("groupAdmin","-password")
  if(!added){
    res.status(400).send("Chat not found");
  }
  else{
    res.json(added);
  }
})
const removefromgroup = asyncHandler(async(req,res)=>{
  const {chatid,userid} = req.body;
  const removed = await Chat.findByIdAndUpdate(chatid,{
    $pull : {users:userid},
  },
  {new :true}
).populate("users","-password")
.populate("groupAdmin","-password")
if(!removed){
  res.status(400).send("Chat not found");
}
else{
  res.json(removed);
}

})

module.exports = { accessChat,fetchchats,creategroupchat,renameGroup,addtogroup,removefromgroup};
