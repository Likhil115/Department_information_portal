import React, { useState } from 'react';
import './Profile.css';
import axios from 'axios';

const ProfilePage = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    userId: user?._id || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImageURL || 'default-profile.png');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleEditClick = () => setIsEditing(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB size limit
        setFeedback('File size exceeds 2MB');
        return;
      }
      const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validFormats.includes(file.type)) {
        setFeedback('Unsupported file format. Please upload a JPEG, PNG, or GIF image.');
        return;
      }
      setImageFile(file); // Store the file object
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file); // Display preview image
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFeedback('Username is required.');
      return;
    }

    const form = new FormData();
    form.append('username', formData.username);
    form.append('userId', formData.userId);

    if (imageFile) {
      form.append('image', imageFile);
    }

    try {
      setLoading(true);
      const response = await axios.put('/user/update', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeedback('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Error updating profile');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get('/user/logout');
      window.location.href = '/login';
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Error logging out');
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {feedback && <div className="feedback-message">{feedback}</div>}
      {!isEditing ? (
        <div className="profile-card">
          <img
            src={previewImage || 'default-profile.png'}
            alt="Profile"
            className="profile-picture"
          />
          <h1 className="profile-name">{formData.username || 'John Doe'}</h1>
          <div className="profile-actions">
            <button onClick={handleEditClick} className="edit-button">
              Edit Profile
            </button>
            <button onClick={handleLogout} className="logout-button" disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Profile Picture:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="profile-picture-preview"
              />
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-button" type="button">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
