// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import LoginPage from './Components/Login';
import SignupPage from './Components/Signup';
import HomePage from './Components/HomePage';
import Publications from './Components/Publications';
import Projects from './Components/Projects';
import Conferences from './Components/Conferences';
import Scholarships from './Components/Scholarships';
import Rewards from './Components/Rewards';
import Patents from './Components/Patents';
import ProfilePage from './Components/Profile';

function App() {
  const [user, setUser] = useState(null);

  // Check for user authentication on load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get('/auth/user', { withCredentials: true });
        setUser(response.data.user); // Assuming the API returns { user: { username, email, ... } }
      } catch (error) {
        console.log("User not authenticated", error);
        setUser(null);
      }
    };

    checkUser();
  }, []);

 
  

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage user={user} />} /> {/* Pass user as prop */}
          <Route path="/publications" element={<Publications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/patents" element={<Patents />} />
          <Route path="/profile" element={<ProfilePage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
