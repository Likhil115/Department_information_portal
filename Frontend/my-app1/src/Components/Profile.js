// src/components/ProfilePage.js
import React from 'react';
import './Profile.css';

const ProfilePage = () => {
  const user = {
    username: 'johndoe123',
    email: 'johndoe@example.com',
    userType: 'student',
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User Type:</strong> {user.userType}</p>
      </div>
      <button className="edit-button">Edit Profile</button>
    </div>
  );
};

export default ProfilePage;
