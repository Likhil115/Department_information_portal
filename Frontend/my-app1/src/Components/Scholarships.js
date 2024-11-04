// Scholarships.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Scholarships.css';

// const scholarships = [
//   
//   {
//     title: "Community Leadership Award",
//     amount: "$3,000",
//     eligibility: "Undergraduates with a record of community service",
//     deadline: "February 28, 2024",
//     description: "Award for students actively engaged in community leadership.",
//     url: "https://example.com/community-leadership-award"
//   },
// ];

const Scholarships = () => {

  const [scholarships, setData] = useState([]);

useEffect(() => {
  axios.get('/api/scholarships')  // Adjust URL if needed
    .then(response => {
      setData(response.data);  // Store data in state
      // console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);
 


  return (
    <div className="scholarships-page">
      <h1 className="page-title">Scholarships</h1>
      <p className="page-subtitle">Explore opportunities to fund your education</p>
      
      <motion.div
        className="carousel-container"
        drag="x"
        dragConstraints={{ left: -400, right: 0 }}
      >
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={index}
            className="scholarship-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="scholarship-title">{scholarship.title}</h2>
            <p className="scholarship-amount">Amount: {scholarship.amount}</p>
            <p className="scholarship-eligibility">Eligibility: {scholarship.eligibility}</p>
            <p className="scholarship-deadline">Deadline: {scholarship.deadline}</p>
            <p className="scholarship-description">{scholarship.description}</p>
            <a
              href={scholarship.url}
              target="_blank"
              rel="noopener noreferrer"
              className="scholarship-link"
            >
              Apply Now
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Scholarships;
