// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path=require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const authRoutes=require("./routes/authroute");

const userroute=require("./routes/user");
const apiroute=require("./routes/api");

// const auth=require("./middleware/authenticate");

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

const PORT = process.env.PORT || 5000;


mongoose.connect("mongodb://127.0.0.1:27017/DIS")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.static(path.resolve("./public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/auth",authRoutes );
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/user",userroute);
app.use("/api",apiroute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
