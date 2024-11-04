// Conferences.js
import { motion } from 'framer-motion';
import './Conferences.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const conferences = [
  // {
  //   title: "International Conference on AI in Healthcare",
  //   location: "New York, USA",
  //   date: "June 15-17, 2023",
  //   description: "A platform to discuss the latest advancements in AI applications within healthcare.",
  //   url: "https://example.com/ai-healthcare-conference"
  // },
  
// ];

const Conferences = () => {

  
  const [conferences, setData] = useState([]);

useEffect(() => {
  axios.get('/api/conferences')  // Adjust URL if needed
    .then(response => {
      setData(response.data);  // Store data in state
      // console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);


  return (
    <div className="conferences-page">
      <div className="parallax-background">
        <h1 className="page-title">Conferences</h1>
      </div>
      <div className="conferences-container">
        <p className="page-subtitle">Join us at upcoming events around the world</p>
        
        <div className="conferences-grid">
          {conferences.map((conf, index) => (
            <motion.div
              key={index}
              className="conference-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <h2 className="conference-title">{conf.title}</h2>
              <p className="conference-location">{conf.location}</p>
              <p className="conference-date">{conf.date}</p>
              <p className="conference-description">{conf.description}</p>
              <a 
                href={conf.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="conference-link"
              >
                More Details
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Conferences;
