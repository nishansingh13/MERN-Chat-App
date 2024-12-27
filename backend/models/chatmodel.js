const mongoose = require('mongoose');
const chatmodel = mongoose.Schema(
    {
        chatName : {type : String, trim : true}, //trim - avoiding trailing spaces
        isGroupChat : {type : Boolean , default : false},
        users : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
            },
        ],
        latestMessages : {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Message",
        },
        groupAdmin : {
            type :  mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
        
    }
    ,
        {
            timestamps : true,
        }
)
const chat = mongoose.model("Chat",chatmodel);
module.exports = chat; 