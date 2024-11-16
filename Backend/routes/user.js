const express = require("express");
const router = express.Router();
const user = require("../models/user");
const { createHmac, randomBytes } = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require('fs'); // Import fs


// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer middleware with limits and file type validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});


router.put("/update", upload.single('image'), async (req, res) => {
  try {
    const { userId, username} = req.body;
    // console.log(req.body);
    const u = await user.findById(userId);

    if (!u) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username) u.username = username;
    

    // Update profile image if uploaded
    console.log(req.file)
    if (req.file) {
      const oldImagePath = u.profileImageURL.replace('/uploads/', './uploads/');
      if (fs.existsSync(oldImagePath) && oldImagePath !== './uploads/default-profile.png') {
        fs.unlinkSync(oldImagePath);
      }
      u.profileImageURL = `/uploads/${req.file.filename}`;
      console.log(u.profileImageURL)
    }

    await u.save();
    res.json({ message: 'Profile updated successfully', u });
  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds the allowed limit of 5MB' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// User signup route
router.post("/signup", upload.single("image"), async (req, res) => {
  const { username, email, password, confirmPassword, userType } = req.body;
  const image = req.file;

  if (!email || !username || !password || !confirmPassword || !userType || !image) {
    return res.status(400).json({ message: "All fields, including image, are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const imageUrl = `/uploads/${image.filename}`; // Correct image URL field
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

  try {
    // Check if the user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
      userType,
      salt,
      profileImageURL: imageUrl, // Correct property name for storing image URL
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "An error occurred during signup" });
  }
});

// User signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await user.matchpasswordandreturntoken(email, password);
    res.cookie("uid", token);
    return res.redirect("/");
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(400).render("signin", {
      error: "Incorrect email or password",
    });
  }
});

// User logout route
router.get("/logout", (req, res) => {
  req.user = null;
  res.clearCookie("uid");
  res.status(200).json({ message: "Logged out successfully" });
});

// Render signin page
router.get("/signin", (req, res) => {
  res.render("signin");
});

// Render signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
