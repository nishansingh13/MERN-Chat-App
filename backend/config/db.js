const mongoose = require("mongoose");
const colors = require("colors");
const connectDB= async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
    }
    catch(err){
        console.log(`Error is ${err.message}`); 
        process.exit();
    }
}
module.exports = connectDB;