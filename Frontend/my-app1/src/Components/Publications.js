// Publications.js
import { motion } from 'framer-motion';
import './Publications.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const publication = [
//   {
//     title: "Deep Learning in Cybersecurity",
//     authors: "Dr. Alice Smith, Dr. Bob Johnson",
//     year: 2023,
//     description: "An exploration of deep learning methods in detecting and mitigating cybersecurity threats.",
//     url: "https://example.com/deep-learning-cybersecurity"
//   },
//   {
//     title: "Advances in Natural Language Processing",
//     authors: "Dr. Carol White, Dr. David Green",
//     year: 2022,
//     description: "A study on recent developments in NLP and its applications in real-world scenarios.",
//     url: "https://example.com/nlp-advances"
//   },
  // {
  //   title: "Quantum Computing and Cryptography",
  //   authors: "Dr. Eva Brown, Dr. Frank Wilson",
  //   year: 2024,
  //   description: "Examining the impact of quantum computing on cryptographic algorithms and data security.",
  //   url: "https://example.com/quantum-cryptography"
  // },
// ];


const Publications = () => {
  const [publications, setData] = useState([]);

useEffect(() => {
  axios.get('/api/publications')  // Adjust URL if needed
    .then(response => {
      setData(response.data);  // Store data in state
      // console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);
 
  return (
    <div className="publications-container">
      <h1 className="publications-title">Publications</h1>
      <p className="publications-subtitle">Discover our recent research and publications</p>

      <div className="publications-card-container">
        {publications.map((pub, index) => (
          <motion.div
            key={index}
            className="publication-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="publication-title">{pub.title}</h2>
            <p className="publication-authors"><strong>Authors:</strong> {pub.authors}</p>
            <p className="publication-year"><strong>Year:</strong> {pub.year}</p>
            <p className="publication-description">{pub.description}</p>
            <a 
              href={pub.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="publication-link"
            >
              Read More
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Publications;
