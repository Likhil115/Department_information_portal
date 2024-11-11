import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaProjectDiagram, FaMedal, FaGraduationCap, FaCertificate, FaAward, FaSignInAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Homepage.css';
import axios from 'axios';

const HomePage = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const sections = [
    { name: "Publications", icon: <FaBook />, path: "/publications", description: "Explore recent research and publications." },
    { name: "Projects", icon: <FaProjectDiagram />, path: "/projects", description: "Discover current and completed projects." },
    { name: "Scholarships", icon: <FaGraduationCap />, path: "/scholarships", description: "Find scholarship opportunities." },
    { name: "Rewards", icon: <FaMedal />, path: "/rewards", description: "View awards and recognitions." },
    { name: "Conferences", icon: <FaCertificate />, path: "/conferences", description: "Upcoming conferences and workshops." },
    { name: "Patents", icon: <FaAward />, path: "/patents", description: "Browse patented research and inventions." },
    !user && { name: "Login", icon: <FaSignInAlt />, path: "/login", description: "Sign in to access more features." },
  ].filter(Boolean);

  const handleLogout = async () => {
    try {
      await axios.get('/user/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || 'Error logging out');
    }
  };

  return (
    <div className="homepage">
      {/* Sidebar */}
      <motion.div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="sidebar-links">
          {sections.map((section) => (
            <Link to={section.path} key={section.name} className="sidebar-link">
              <div className="sidebar-icon">{section.icon}</div>
              <span>{section.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        {/* Profile Icon */}
        {user && (
          <div className="profile-container" onClick={toggleDropdown}>
            <FaUserCircle size={30} className="profile-icon" />
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <img src={`http://localhost:5000/${user.profileImageURL}`} alt="Profile" className="profile-image" />
                  <p><strong>{user.username}</strong></p>
                  <p>{user.email}</p>
                </div>
                <div className="dropdown-links">
                  <Link to="/profile" className="dropdown-link">Profile</Link>
                  <button onClick={handleLogout} className="dropdown-link logout">Logout</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Welcome to the Department Information Portal</h1>
          <p className="hero-subtitle">Navigate through resources and information tailored for you.</p>
        </div>

        {/* Cards Section */}
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
    </div>
  );
};

export default HomePage;
