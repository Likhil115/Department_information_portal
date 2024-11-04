const express=require("express")
const mongoose=require("mongoose")


const publicationschema=mongoose.Schema({
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


},{timestamps:true});


const publications=mongoose.model("publications",publicationschema);

module.exports=publications;