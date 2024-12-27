const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generatetoken = require("../config/generatetoken");

const registeruser = async(req,res)=>{
    const {name , email , password , pic } = req.body;
    if(!name || !email || !password){
        res.status(404);
        throw new Error("Fill all fields please");
    }
    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400);
        throw new Error("User already exist!!");

    }
    const user = await User.create({name , email , password, pic});
    if(user){
        res.status(201).json({_id : user._id, name: user.name , email : user.email, pic : user.pic , token : generatetoken(user._id)});
    }
    else{
        throw new Error("Failed to Create Userr");
    }
}
module.exports = {registeruser};