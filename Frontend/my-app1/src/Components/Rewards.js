import { motion, AnimatePresence } from 'framer-motion';
import './Rewards.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rewards = ({ user }) => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', eligibility: '', url: '' });
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState(''); // New state for filter input

  useEffect(() => {
    axios.get('/api/rewards')
      .then(response => {
        setRewards(response.data);
        setFilteredRewards(response.data); // Initialize filtered rewards
      })
      .catch(error => {
        console.error("Error fetching rewards data:", error);
      });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: '', description: '', eligibility: '', url: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

    // Filter rewards by title, description, or eligibility
    const filtered = rewards.filter(
      reward =>
        reward.title.toLowerCase().includes(value) ||
        reward.description.toLowerCase().includes(value) ||
        reward.eligibility.toLowerCase().includes(value)
    );
    setFilteredRewards(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rewardData = isEditing ? { ...formData } : { ...formData, createdBy: user._id };

      const response = isEditing
        ? await axios.put(`/api/rewards/${editData._id}`, rewardData)
        : await axios.post('/api/rewards', rewardData);

      if (isEditing) {
        setRewards(rewards.map(reward => reward._id === editData._id ? response.data : reward));
      } else {
        setRewards([...rewards, response.data]);
      }

      setFilteredRewards([...rewards, response.data]); // Update filtered rewards
      closeModal();
    } catch (error) {
      console.error("Error saving reward:", error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this reward?");
      if (!confirmed) return;

      await axios.delete(`/api/rewards/${id}`);
      const updatedRewards = rewards.filter(reward => reward._id !== id);
      setRewards(updatedRewards);
      setFilteredRewards(updatedRewards); // Update filtered rewards
    } catch (error) {
      console.error("Error deleting reward:", error);
    }
  };

  const handleEdit = (reward) => {
    setIsEditing(true);
    setEditData(reward);
    setFormData({ ...reward });
    setIsModalOpen(true);
  };

  return (
    <div className="rewards-page">
      <h1 className="page-title">Rewards</h1>
      <p className="page-subtitle">Recognizing excellence in our department</p>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search rewards by title, description, or eligibility"
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      {user && (
        <motion.button
          onClick={openModal}
          className="add-reward-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEditing ? 'Edit Reward' : 'Add New Reward'}
        </motion.button>
      )}

      <div className="reward-container">
        {filteredRewards.map((reward) => (
          <motion.div
            key={reward._id}
            className="reward-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            {user && (String(user._id) === String(reward.createdBy) || String(user._id) === "67268769c54d481cc698dd3a") && (
              <div className="action-buttons">
                <motion.button
                  onClick={() => handleEdit(reward)}
                  className="edit-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(reward._id)}
                  className="delete-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Delete
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "100vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{isEditing ? 'Edit Reward' : 'Add New Reward'}</h2>
              <form onSubmit={handleSubmit} className="reward-form">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="eligibility"
                  placeholder="Eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="url"
                  name="url"
                  placeholder="URL"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                />
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? 'Update' : 'Submit'}
                </motion.button>
              </form>
              <motion.button
                className="close-button"
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
              Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rewards;
