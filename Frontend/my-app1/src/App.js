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
import Navbar from './Components/Navbar';

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
      {/* <Navbar user={user}/> */}
      <div className="App">
        <Routes>
          <Route path="/login" element={<><Navbar user={user} /><LoginPage /></>} />
          <Route path="/signup" element={<><Navbar user={user} /><SignupPage /></>} />
          <Route path="/" element={<HomePage user={user} />} /> {/* Pass user as prop */}
          <Route path="/publications" element={<><Navbar user={user} /><Publications user={user} /></>} />
          <Route path="/projects" element={<><Navbar user={user} /><Projects user={user} /></>} />
          <Route path="/conferences" element={<><Navbar user={user} /><Conferences user={user} /></>} />
          <Route path="/scholarships" element={<><Navbar user={user} /><Scholarships user={user} /></>} />
          <Route path="/rewards" element={<><Navbar user={user} /><Rewards user={user} /></>} />
          <Route path="/patents" element={<><Navbar user={user} /><Patents user={user} /></>} />
          <Route path="/profile" element={<><Navbar user={user} /><ProfilePage user={user} /></>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
