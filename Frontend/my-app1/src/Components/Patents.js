// Patents.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Patents.css';

// const patents = [
  // {
  //   title: "Innovative Machine Learning Algorithm",
  //   description: "A novel algorithm for enhanced data processing using machine learning.",
  //   patentNumber: "US12345678B2",
  //   url: "https://example.com/machine-learning-algorithm"
  // },
 
// ];

const Patents = () => {

  
  const [patents, setData] = useState([]);

useEffect(() => {
  axios.get('/api/patents')  // Adjust URL if needed
    .then(response => {
      setData(response.data);  // Store data in state
      // console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);

  return (
    <div className="patents-page">
      <h1 className="page-title">Patents</h1>
      <p className="page-subtitle">Innovations from our department</p>
      <div className="patent-container">
        {patents.map((patent, index) => (
          <motion.div
            key={index}
            className="patent-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="patent-title">{patent.title}</h2>
            <p className="patent-description">{patent.description}</p>
            <p className="patent-number">Patent Number: {patent.patentNumber}</p>
            <a
              href={patent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="patent-link"
            >
              Learn More
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Patents;
