const express=require("express")
const mongoose=require("mongoose")


const rewardschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    
   
    description:{
        type:String,
        required:true,

    },
    eligibility:{
        type:String,
        required:true,

    },
    url:{
        type:String,
        required:true,

    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    },


},{timestamps:true});


const rewards=mongoose.model("rewards",rewardschema);

module.exports=rewards;