const mongoose=require("mongoose");

const conferenceschema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,

    },
    date:{
        type:Date,
        required:true,

    },
    description:{
        type:String,
        required:true,

    },
    url:{
        type:String,
        required:true,

    },


},{timestamps:true});


const conferences=mongoose.model("conferences",conferenceschema);

module.exports=conferences;