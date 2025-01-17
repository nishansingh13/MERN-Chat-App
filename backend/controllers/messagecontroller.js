const asynchandler = require("express-async-handler");
const Message = require("../models/messagemodel");
const User = require("../models/UserModel");
const Chat = require("../models/chatmodel");

const sendmessage = asynchandler(async (req, res) => {
    const { content, chatId } = req.body;

    // console.log(req.body); // Log incoming data

    if (!content || !chatId) {
        console.log("Invalid data: content or chatId missing");
        return res.status(400).json({ message: "Content or Chat ID is missing" });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(400).json({ message: "Chat not found" });
    }

    const newmessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        let message = await Message.create(newmessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.json(message);

    } catch (err) {
        console.error(err); // Log actual error
        res.status(400).json({ message: "Failed to send message" });
    }
});
const allMessages = asynchandler(async(req,res)=>{
    try {
            const message = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");
            res.json(message)
    } catch (error) {
            res.status(400);
            
    }
})
const deleteMessage = asynchandler(async(req,res)=>{
        try{
            const data = req.body;
            const message = await Message.findByIdAndDelete(data)
            res.json(message)

        }catch{
            res.status(400);

        }
})
module.exports = { sendmessage , allMessages ,deleteMessage};
