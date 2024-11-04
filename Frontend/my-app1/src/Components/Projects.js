import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Projects.css';

// const projects = [
//   {
//     title: "Blockchain for Secure Data Exchange",
//     lead: "Dr. Michael Brown",
//     year: 2024,
//     description: "Using blockchain to create secure and tamper-proof data exchange protocols.",
//     url: "https://example.com/blockchain-data"
//   },
//   // Add more project objects as needed
// ];

const Projects = () => {

  
  const [projects, setData] = useState([]);

useEffect(() => {
  axios.get('/api/projects')  // Adjust URL if needed
    .then(response => {
      setData(response.data);  // Store data in state
      // console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);


  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>
      <p className="projects-subtitle">Explore our innovative projects and initiatives</p>

      <div className="projects-card-container">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="project-card"
            whileHover={{ rotate: 3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <h2 className="project-title">{project.title}</h2>
            <p className="project-lead"><strong>Lead:</strong> {project.lead}</p>
            <p className="project-year"><strong>Year:</strong> {project.year}</p>
            <p className="project-description">{project.description}</p>
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link"
            >
              View Project
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
