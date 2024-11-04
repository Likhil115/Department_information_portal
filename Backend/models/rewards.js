const express=require("express")
const mongoose=require("mongoose")


const rewardschema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    
   
    description:{
        type:String,
        required:true,

    },
    eligiblity:{
        type:String,
        required:true,

    },
    url:{
        type:String,
        required:true,

    },


},{timestamps:true});


const rewards=mongoose.model("rewards",rewardschema);

module.exports=rewards;