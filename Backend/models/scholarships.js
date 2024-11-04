const express=require("express")
const mongoose=require("mongoose")


const scholarshipschema=mongoose.Schema({
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
    eligiblity:{
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


},{timestamps:true});


const scholarships=mongoose.model("scholarships",scholarshipschema);

module.exports=scholarships;