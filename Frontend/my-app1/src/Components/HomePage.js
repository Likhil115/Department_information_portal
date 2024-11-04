// src/components/HomePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaProjectDiagram, FaMedal, FaGraduationCap, FaCertificate, FaAward, FaSignInAlt, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Homepage.css';
import axios from 'axios';




const HomePage = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Toggle the dropdown for profile details
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Define sections without Login if the user is authenticated
  var sections=[]
  if(user){
  sections = [
    { name: "Publications", icon: <FaBook />, path: "/publications", description: "Explore recent research and publications." },
    { name: "Projects", icon: <FaProjectDiagram />, path: "/projects", description: "Discover current and completed projects." },
    { name: "Scholarships", icon: <FaGraduationCap />, path: "/scholarships", description: "Find scholarship opportunities." },
    { name: "Rewards", icon: <FaMedal />, path: "/rewards", description: "View awards and recognitions." },
    { name: "Conferences", icon: <FaCertificate />, path: "/conferences", description: "Upcoming conferences and workshops." },
    { name: "Patents", icon: <FaAward />, path: "/patents", description: "Browse patented research and inventions." },
  ];
}

  // Add login option to sections if the user is not authenticated
  if (!user) {
    sections.push({ name: "Login", icon: <FaSignInAlt />, path: "/login", description: "Sign in to access more features." });
  }
  
  const handleLogout = async () => {
    try {
      await axios.get('/user/logout'); // Adjust the URL as necessary
      // Optionally, you can redirect or update your state to remove user information
      window.location.href = '/login'; // Redirect to the login page after logout
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || 'Error logging out');
    }
  };
  return (
    <div className="homepage-container">
      {/* Profile Icon with Dropdown */}
      {user && (
        
        <div
          className="profile-container"
          onClick={toggleDropdown}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          <FaUserCircle size={30} className="profile-icon" />
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
              
              {user.profileImageURL ? (
               
                <img src={`http://localhost:5000/${user.profileImageURL}`} alt="Profile" className="profile-image" />
              ) : (
                <FaUserCircle size={50} className="profile-avatar" />
              )}
                <p><strong>{user.username}</strong></p>
                <p>{user.email}</p>
              </div>
              <div className="dropdown-links">
                <Link to="/profile" className="dropdown-link">Profile</Link>
                {/* <Link to="/settings" className="dropdown-link">Settings</Link> */}
                {/* <Link to="/orders" className="dropdown-link">Order History</Link> */}
                <button onClick={handleLogout} className="dropdown-link logout">Logout</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <h1 className="homepage-title">Department Information Portal (DIP)</h1>
      <p className="homepage-subtitle">Navigate through various department resources</p>
      
      <div className="card-container">
        {sections.map((section) => (
          <Link to={section.path} key={section.name} className="card-link">
            <motion.div
              className="card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="icon-container">{section.icon}</div>
              <h2 className="card-title">{section.name}</h2>
              <p className="card-description">{section.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
