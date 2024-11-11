const express=require("express")
const mongoose=require("mongoose")


const publicationschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    authors:{
        type:String,
        required:true,

    },
    year:{
        type:Number,
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


const publications=mongoose.model("publications",publicationschema);

module.exports=publications;