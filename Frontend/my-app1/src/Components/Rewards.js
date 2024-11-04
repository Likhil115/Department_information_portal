// Rewards.js
import { motion } from 'framer-motion';
import './Rewards.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// const rewards = [
  // {
  //   title: "Outstanding Academic Achievement",
  //   description: "Awarded to students with the highest GPA in their program.",
  //   eligibility: "All undergraduate students",
  //   url: "https://example.com/academic-achievement"
  // },
  // {
  //   title: "Community Service Excellence",
  //   description: "Recognizing significant contributions to community service.",
  //   eligibility: "All students engaged in community work",
  //   url: "https://example.com/community-service"
  // },
//   {
//     title: "Research Innovation Award",
//     description: "For the most innovative research project of the year.",
//     eligibility: "Graduate students with a completed research project",
//     url: "https://example.com/research-innovation"
//   },
// ];

const Rewards = () => {
  const [rewards, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/rewards')  // Adjust URL if needed
      .then(response => {
        setData(response.data);  // Store data in state
        // console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);


  return (
    <div className="rewards-page">
      <h1 className="page-title">Rewards</h1>
      <p className="page-subtitle">Recognizing excellence in our department</p>
      <div className="reward-container">
        {rewards.map((reward, index) => (
          <motion.div
            key={index}
            className="reward-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="reward-title">{reward.title}</h2>
            <p className="reward-description">{reward.description}</p>
            <p className="reward-eligibility">Eligibility: {reward.eligibility}</p>
            <a
              href={reward.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reward-link"
            >
              Learn More
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
