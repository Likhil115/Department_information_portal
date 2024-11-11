const express=require("express")
const mongoose=require("mongoose")


const scholarshipschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,

    },
    deadline:{
        type:String,
        required:true,

    },
    eligibility:{
        type:String,
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
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
    },


},{timestamps:true});


const scholarships=mongoose.model("scholarships",scholarshipschema);

module.exports=scholarships;