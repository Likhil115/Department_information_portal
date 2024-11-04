const publications = require("../models/publications");
const rewards = require("../models/rewards");
const scholarships = require("../models/scholarships");
const patents = require("../models/patents");
const projects = require("../models/projects");
const conferences = require("../models/conferences");

const express = require('express');
const router = express.Router();

router.get("/publications", async (req, res) => { // Mark the function as async
  try {
    
    const data = await publications.find({}); // Use await to wait for the data
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching items.' });
  }
});


router.get("/rewards", async (req, res) => { // Mark the function as async
    try {
      const data = await rewards.find({}); // Use await to wait for the data
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
  });

module.exports = router;


router.get("/scholarships", async (req, res) => { // Mark the function as async
    try {
      const data = await scholarships.find({}); // Use await to wait for the data
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
  });

module.exports = router;


router.get("/patents", async (req, res) => { // Mark the function as async
    try {
      const data = await patents.find({}); // Use await to wait for the data
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
  });

module.exports = router;


router.get("/projects", async (req, res) => { // Mark the function as async
    try {
      const data = await projects.find({}); // Use await to wait for the data
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
  });

module.exports = router;


router.get("/conferences", async (req, res) => { // Mark the function as async
    try {
      const data = await conferences.find({}); // Use await to wait for the data
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
  });

module.exports = router;