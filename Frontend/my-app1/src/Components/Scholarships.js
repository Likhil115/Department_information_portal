// Scholarships.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Scholarships.css';

const Scholarships = ({user}) => {

  const [scholarships, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', eligibility: '',deadline: '', description: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);  
  const [editData, setEditData] = useState(null); 
 
  

useEffect(() => {
  setLoading(false)
  setError('')
  axios.get('/api/scholarships')  // Adjust URL if needed
    .then(response => {
      setData(response.data);  // Store data in state
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);
 
const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: '', amount: '', eligibility: '',deadline: '', description: '', url: '' });
  };
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = isEditing
      ? await axios.put(`/api/scholarships/${editData._id}`, formData)
      : await axios.post('/api/scholarships', formData);
  
    if (isEditing) {
      setData(scholarships.map(pub => pub._id === editData._id ? response.data : pub));
    } else {
      setData([...scholarships, response.data]);
    }
    closeModal();
  } catch (error) {
    console.error("Error saving project:", error);
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/scholarships/${id}`);
    setData(scholarships.filter(pub => pub._id !== id));
  } catch (error) {
    console.error("Error deleting scholarship:", error);
  }
};


const handleEdit = (scholarship) => {
  setIsEditing(true);
  setEditData(scholarship);
  setFormData({ ...scholarship});
  setIsModalOpen(true);
  
};

  return (
    <div className="scholarships-page">
      <h1 className="page-title">Scholarships</h1>
      <p className="page-subtitle">Explore opportunities to fund your education</p>
      
     {user && ( <motion.button
        onClick={openModal}
        className="add-publication-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Add New Scholarship
      </motion.button>)}


      <motion.div
        className="carousel-container"
        drag="x"
        dragConstraints={{ left: -400, right: 0 }}
      >
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={index}
            className="scholarship-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="scholarship-title">{scholarship.title}</h2>
            <p className="scholarship-amount">Amount: {scholarship.amount}</p>
            <p className="scholarship-eligibility">Eligibility: {scholarship.eligibility}</p>
            <p className="scholarship-deadline">Deadline: {scholarship.deadline}</p>
            <p className="scholarship-description">{scholarship.description}</p>
            <a
              href={scholarship.url}
              target="_blank"
              rel="noopener noreferrer"
              className="scholarship-link"
            >
              Apply Now
            </a>

          {user && scholarship && (String(user._id)===String(scholarship._createdBy) || String(user._id)==="67268769c54d481cc698dd3a") && (  <div className="action-buttons">
              <motion.button
                onClick={() => handleEdit(scholarship)}
                className="edit-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Edit
              </motion.button>
              <motion.button
                onClick={() => handleDelete(scholarship._id)}
                className="delete-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Delete
              </motion.button>
            </div>)}
            

          </motion.div>
        ))}
      </motion.div>
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
              <h2>Add New Scholarship</h2>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit} className="publication-form">
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
                  placeholder="Scholarship Amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
                 <input
                  type="text"
                  name="eligibility"
                  placeholder="Eligiblity criteria"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="deadline"
                  placeholder="Deadline"
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
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
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

export default Scholarships;
