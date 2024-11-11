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

  router.post('/publications', async (req, res) => {
    try {
    //  console.log(req.body.user._id);
    const newPublication = new publications(req.body);
    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add publication' });
    }
  });

  router.post('/projects', async (req, res) => {
    try {
      const newprojects = new projects(req.body);
      const savedproject = await newprojects.save();
      res.status(201).json(savedproject);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add publication' });
    }
  });

  router.post('/scholarships', async (req, res) => {
    try {
      const newscholarships = new scholarships(req.body);
      const savedscholarships = await newscholarships.save();
      res.status(201).json(savedscholarships);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add publication' });
    }
  });
 
  router.post('/rewards', async (req, res) => {
    try {
        const newReward = new rewards(req.body); // Ensure `rewards` is the correct model
        const savedReward = await newReward.save();
        res.status(201).json(savedReward);
    } catch (error) {
        console.error("Error saving reward:", error); // Log the error
        res.status(500).json({ error: 'Failed to add reward' });
    }
});

  router.post('/conferences', async (req, res) => {
    try {
      const newconf = new conferences(req.body);
      const savedconf = await newconf.save();
      res.status(201).json(savedconf);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add publication' });
    }
  });
  router.post('/patents', async (req, res) => {
    try {
      const newpatent = new patents(req.body);
      const savedpatent = await newpatent.save();
      res.status(201).json(savedpatent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add publication' });
    }
  });



  router.delete('/publications/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPublication = await publications.findByIdAndDelete(id);
  
      if (!deletedPublication) {
        return res.status(404).json({ message: 'Publication not found' });
      }
  
      res.status(200).json({ message: 'Publication deleted successfully' });
    } catch (error) {
      console.error('Error deleting publication:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });


  router.put('/publications/:id', async (req, res) => {
    try {
        const updatedPublication = await publications.findByIdAndUpdate(
            req.params.id,     
            req.body,           
            { new: true }
        );
        if (!updatedPublication) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.status(200).json(updatedPublication); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to update publication' });
    }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPublication = await projects.findByIdAndDelete(id);

    if (!deletedPublication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/projects/:id', async (req, res) => {
  try {
      const updatedPublication = await projects.findByIdAndUpdate(
          req.params.id,     
          req.body,           
          { new: true }
      );
      if (!updatedPublication) {
          return res.status(404).json({ error: 'Publication not found' });
      }
      res.status(200).json(updatedPublication); 
  } catch (error) {
      res.status(500).json({ error: 'Failed to update publication' });
  }
});

router.delete('/scholarships/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPublication = await scholarships.findByIdAndDelete(id);

    if (!deletedPublication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/scholarships/:id', async (req, res) => {
  try {
      const updatedPublication = await scholarships.findByIdAndUpdate(
          req.params.id,     
          req.body,           
          { new: true }
      );
      if (!updatedPublication) {
          return res.status(404).json({ error: 'Publication not found' });
      }
      res.status(200).json(updatedPublication); 
  } catch (error) {
      res.status(500).json({ error: 'Failed to update publication' });
  }
});



router.delete('/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedreward = await rewards.findByIdAndDelete(id);

    if (!deletedreward) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/rewards/:id', async (req, res) => {
  try {
      const updatedreward = await rewards.findByIdAndUpdate(
          req.params.id,     
          req.body,           
          { new: true }
      );
      if (!updatedreward) {
          return res.status(404).json({ error: 'Publication not found' });
      }
      res.status(200).json(updatedreward); 
  } catch (error) {
      res.status(500).json({ error: 'Failed to update publication' });
  }
});

router.delete('/conferences/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedreward = await conferences.findByIdAndDelete(id);

    if (!deletedreward) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/conferences/:id', async (req, res) => {
  try {
      const updatedreward = await conferences.findByIdAndUpdate(
          req.params.id,     
          req.body,           
          { new: true }
      );
      if (!updatedreward) {
          return res.status(404).json({ error: 'Publication not found' });
      }
      res.status(200).json(updatedreward); 
  } catch (error) {
      res.status(500).json({ error: 'Failed to update publication' });
  }
});

router.delete('/patents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedreward = await patents.findByIdAndDelete(id);

    if (!deletedreward) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/patents/:id', async (req, res) => {
  try {
      const updatedreward = await patents.findByIdAndUpdate(
          req.params.id,     
          req.body,           
          { new: true }
      );
      if (!updatedreward) {
          return res.status(404).json({ error: 'Publication not found' });
      }
      res.status(200).json(updatedreward); 
  } catch (error) {
      res.status(500).json({ error: 'Failed to update publication' });
  }
});



module.exports = router;