const express=require("express")
const mongoose=require("mongoose")


const projectschema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    lead:{
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


const projects=mongoose.model("projects",projectschema);

module.exports=projects;