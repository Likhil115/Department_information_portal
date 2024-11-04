const express=require("express")
const router=express.Router();
const user=require("../models/user")
const {createHmac,randomBytes}=require("crypto");
const {setUser}=require("../services/user")

router.post("/signup", async (req, res) => {
    const { username, email, password, confirmPassword, userType } = req.body;

    // Check for missing fields
    if (!email || !username || !password || !confirmPassword || !userType) {
        return res.status(400).json({ message: "All fields are required" });
    }
   
       
    // Confirm password check
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt=randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    try {
        // Create new user
        const existingUser = await user.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await user.create({
            username,
            email,
            password: hashedPassword,
            userType,
            salt,
        });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "An error occurred during signup" });
    }
});


router.post("/signin",async(req,res)=>{
    
    const {email,password}=req.body;
    
   

   try { const token=await user.matchpasswordandreturntoken(email,password);
    res.cookie("uid",token);
    return res.redirect("/");}
    catch(error){
        
        return res.render("signin",{
            error:"Incorrect email or password",
        });
    }

});

router.get("/logout",(req,res)=>{
   req.user=null;
   res.clearCookie("uid");
   res.status(200).json({ message: 'Logged out successfully' });

})


router.get("/signin",(req,res)=>{
    res.render("signin");
})

router.get("/signup",(req,res)=>{
    
    return res.render("signup");
})



module.exports=router;