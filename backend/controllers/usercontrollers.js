const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generatetoken = require("../config/generatetoken");

const registeruser = asyncHandler(async(req,res)=>{
    const {name , email , password , pic } = req.body;
    if(!name || !email || !password){
        res.status(404);
        throw new Error("Fill all fields please");
    }
    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400).json({message : "User exists already!!"});
        throw new Error("User already exist!!");

    }
    const user = await User.create({name , email , password, pic});

    if(user.pic!=""){
        res.status(201).json({_id : user._id, name: user.name , email : user.email, pic : user.pic , token : generatetoken(user._id)});
    }
    else if(user.pic==""){
        res.status(201).json({_id : user._id, name: user.name , email : user.email, token : generatetoken(user._id)});
   
    }
    else{
        throw new Error("Failed to Create Userr");
    }
})
const authUser = asyncHandler(async(req,res)=>{
    console.log("working");
    const {email,password} = req.body;


    const user = await User.findOne({email});
   
    
    if(user && (await user.matchpass(password))){
        res.status(200);
        res.json({_id : user._id, name: user.name , email : user.email, pic : user.pic , token : generatetoken(user._id)});

    }
    else{
        res.status(400).json({message:"wrong email or pass"});
        throw new Error("Wrong email or password!!");
    }
})
const allUsers = asyncHandler(async(req,res)=>{
        const keyword = req.query.search ? {
            $or: [
                {  name: {$regex : req.query.search, $options:"i"} },
                { email : {$regex : req.query.search, $options:"i"}}
            ]
        }: {};
        //ne meaning not equal to logged in user 
        //
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); 
        // console.log(users);
        res.send(users);
        // res.send(users);
})
const changename = asyncHandler(async(req, res) => {
    const { id, updatedname } = req.body;
    
    
    const user = await User.findByIdAndUpdate(id, { name: updatedname }, { new: true });

 
    if (user) {
        res.status(200).json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            pic: user.pic 
        });
    } else {
        res.status(404).json({ message: "User not found" });
        throw new Error("User not found");
    }
});
const changeprofile = asyncHandler(async(req,res)=>{
    const { id, imagelink } = req.body;
    const user = await User.findByIdAndUpdate(id, { pic: imagelink }, { new: true });
    if (user) {
        res.status(200).json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            pic: user.pic 
        });
    } else {
        res.status(404).json({ message: "User not found" });
        throw new Error("User not found");
    }
})

module.exports = {registeruser,authUser,allUsers,changename,changeprofile};