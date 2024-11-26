import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Scholarships.css';

const Scholarships = ({ user }) => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    eligibility: '',
    deadline: '',
    description: '',
    url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/scholarships')
      .then((response) => {
        setScholarships(response.data);
        setFilteredScholarships(response.data);
        setLoading(false);
      })
      .catch(() => {
        window.location.reload();
        setError('Error fetching scholarships.');
        setLoading(false);
      });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({
      title: '',
      amount: '',
      eligibility: '',
      deadline: '',
      description: '',
      url: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setFilterText(searchValue);

    const filtered = scholarships.filter(
      (scholarship) =>
        scholarship.title.toLowerCase().includes(searchValue) ||
        scholarship.eligibility.toLowerCase().includes(searchValue) ||
        scholarship.deadline.includes(searchValue)
    );
    setFilteredScholarships(filtered);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (formData.title.length < 5 || formData.title.length > 100) {
      setError('Title must be between 5 and 100 characters.');
      return;
    }
    if (formData.amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    if (new Date(formData.deadline) <= new Date()) {
      setError('Deadline must be a future date.');
      return;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    if (!/^https?:\/\/.+\..+/.test(formData.url)) {
      setError('Please provide a valid URL.');
      return;
    }
  
    setError(''); // Clear previous errors
    setLoading(true);
  
    try {
      const response = isEditing
        ? await axios.put(`/api/scholarships/${editData._id}`, formData)
        : await axios.post('/api/scholarships', formData);
  
      const updatedScholarships = isEditing
        ? scholarships.map((item) =>
            item._id === editData._id ? response.data : item
          )
        : [...scholarships, response.data];
  
      setScholarships(updatedScholarships);
      setFilteredScholarships(updatedScholarships);
      closeModal();
      window.location.reload();

    } catch {
      setError('Failed to save scholarship.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/scholarships/${id}`);
      setScholarships(scholarships.filter((item) => item._id !== id));
      setFilteredScholarships(scholarships.filter((item) => item._id !== id));
      window.location.reload();

    } catch {
      setError('Failed to delete scholarship.');
    }
  };

  const handleEdit = (scholarship) => {
    setIsEditing(true);
    setEditData(scholarship);
    setFormData(scholarship);
    setIsModalOpen(true);
  };

  return (
    <div className="scholarships-page">
      <h1 className="page-title1">Scholarships</h1>
      <p className="page-subtitle1">Find opportunities to fund your dreams</p>

      {/* Filter Input */}
      <input
        type="text"
        className="filter-input"
        placeholder="Search scholarships by title, eligibility, or deadline"
        value={filterText}
        onChange={handleFilterChange}
      />

      {user && (user.userType==="staff" || user.userType==="admin") &&(
        <motion.button
          className="add-scholarship-button"
          onClick={openModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Scholarship
        </motion.button>
      )}

<div className="scholarship-container">
  {loading ? (
    <p className="loading-message">Loading scholarships...</p>
  ) : error ? (
    <p className="error-message">{error}</p>
  ) : filteredScholarships.length > 0 ? (
    filteredScholarships.map((scholarship) => (
      <motion.div
        key={scholarship._id}
        className="scholarship-card"
        whileHover={{
          translateY: -10,
          boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 className="scholarship-title">{scholarship.title}</h2>
        <p className="scholarship-amount">
          <strong>Amount:</strong> {scholarship.amount}
        </p>
        <p className="scholarship-eligibility">
          <strong>Eligibility:</strong> {scholarship.eligibility}
        </p>
        <p className="scholarship-deadline">
          <strong>Deadline:</strong> {scholarship.deadline}
        </p>
        <p className="scholarship-description">{scholarship.description}</p>
        <a
          href={scholarship.url}
          target="_blank"
          rel="noopener noreferrer"
          className="scholarship-link"
        >
          Apply Now
        </a>
        {user && (String(user._id) === String(scholarship.createdBy) || user.userType==="admin") && (
          <div className="action-buttons">
            <motion.button
              className="edit-button"
              onClick={() => handleEdit(scholarship)}
            >
              Edit
            </motion.button>
            <motion.button
              className="delete-button"
              onClick={() => handleDelete(scholarship._id)}
            >
              Delete
            </motion.button>
          </div>
        )}
      </motion.div>
    ))
  ) : (
    <p className="no-scholarships-message">No scholarships available.</p>
  )}
</div>


      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2>{isEditing ? 'Edit Scholarship' : 'Add Scholarship'}</h2>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit} className="scholarship-form">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
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
                  type="date"
                  name="deadline"
                  value={formData.deadline}
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
                  type="url"
                  name="url"
                  placeholder="Application URL"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                />
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.05 }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </motion.button>
              </form>
              <motion.button
                className="close-button"
                onClick={closeModal}
                whileHover={{ scale: 1.05 }}
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

export default Scholarships;
