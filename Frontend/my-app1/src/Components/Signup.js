import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [profilePic, setProfilePic] = useState(null); // For profile picture
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state
  const navigate = useNavigate();

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setImagePreview(URL.createObjectURL(file)); // Generate image preview URL
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate email structure
    const studentRegex = /^[a-zA-Z0-9._%+-]+_[mbp]\d{6}cs@nitc\.ac\.in$/;
    const staffRegex = /^[a-zA-Z0-9._%+-]+@nitc\.ac\.in$/;

    if (studentRegex.test(email)) {
       if (email==="likhil_m241067cs@nitc.ac.in") {
        setUserType('admin');
      } 
      else{
      setUserType('student');}
    } else if (staffRegex.test(email)) {
      setUserType('staff');
    }  
    else {
      setMessage({
        type: 'error',
        text: 'Login with institute email.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true); // Start loading

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('userType', userType);
      if (profilePic) formData.append('image', profilePic);

      const response = await axios.post('/user/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ type: 'success', text: response.data.message });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'An error occurred during signup.',
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create an Account</h2>
        {message && (
          <p className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </p>
        )}
        <form onSubmit={handleSignup} encType="multipart/form-data">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="image">Profile Picture</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Profile Preview" />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="signup-button"
            disabled={isSubmitting} // Disable button during submission
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
