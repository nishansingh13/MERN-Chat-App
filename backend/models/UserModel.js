 const mongoose = require("mongoose");
 const bcrypt = require("bcryptjs");
 const userSchema = mongoose.Schema({
    name :{type : String,required:true },
    email :{ type : String , required:true , unique :true},
    password : {type : String , required : true}, 
    pic : {
        type : String , 
        default : "https://res.cloudinary.com/dqsx8yzbs/image/upload/v1735916416/default_j0t1tk.png"
    }

 },
 {
    timestamps : true
 }
) 
userSchema.methods.matchpass = async function (enteredpass){
   return await bcrypt.compare(enteredpass,this.password);
}
userSchema.pre("save",async function(next){
   if(!this.isModified){
      next();
   }
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password,salt);

})
const User = mongoose.model("User",userSchema);
module.exports = User; 