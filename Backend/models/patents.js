const express=require("express")
const mongoose=require("mongoose")


const patentschema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
   
    description:{
        type:String,
        required:true,

    },
    patentNumber:{
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


const patents=mongoose.model("patents",patentschema);

module.exports=patents;