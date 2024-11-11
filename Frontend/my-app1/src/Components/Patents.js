// Patents.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion ,AnimatePresence} from 'framer-motion';
import './Patents.css';


const Patents = ({user}) => {

  
  const [patents, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [formData, setFormData] = useState({ title: '', description: '', patentNumber: '',  url: '' });
  const [editData, setEditData] = useState(null); // New state for tracking data to edit


useEffect(() => {
  axios.get('/api/patents')  // Adjust URL if needed
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
    setFormData({ title: '', description: '', patentNumber: '',  url: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patentData = isEditing
        ? { ...formData }
        : { ...formData, createdBy: user._id }; // Associate user ID

      const response = isEditing
        ? await axios.put(`/api/patents/${editData._id}`, patentData)
        : await axios.post('/api/patents', patentData);

      if (isEditing) {
        setData(patents.map(pub => pub._id === editData._id ? response.data : pub));
      } else {
        setData([...patents, response.data]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving patent:", error);
    }
  };

  // Delete publication
  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this publication?");
      if (!confirmed) return;

      await axios.delete(`/api/patents/${id}`);
      setData(patents.filter(pub => pub._id !== id));
    } catch (error) {
      console.error("Error deleting patent:", error);
    }
  };

  // Open edit modal with existing data
  const handleEdit = (patent) => {
    setIsEditing(true);
    setEditData(patent);
    setFormData({ ...patent });
    setIsModalOpen(true);
  };


  return (
    <div className="patents-page">
    <h1 className="page-title">Patents</h1>
    <p className="page-subtitle">Innovations from our department</p>

    {user && (
      <motion.button
        onClick={openModal}
        className="add-patent-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isEditing ? 'Edit Patent' : 'Add New Patent'}
      </motion.button>
    )}

    <div className="patent-container">
      {patents.map((patent, index) => (
        <motion.div
          key={index}
          className="patent-card"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="patent-title">{patent.title}</h2>
          <p className="patent-description">{patent.description}</p>
          <p className="patent-number">Patent Number: {patent.patentNumber}</p>
          <a
            href={patent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="patent-link"
          >
            Learn More
          </a>
          {user && patent && (String(user._id) === String(patent.createdBy) || String(user._id) === "67268769c54d481cc698dd3a") && (
            <div className="action-buttons">
              <motion.button
                onClick={() => handleEdit(patent)}
                className="edit-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Edit
              </motion.button>
              <motion.button
                onClick={() => handleDelete(patent._id)}
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
              <h2>{isEditing ? 'Edit Publication' : 'Add New Publication'}</h2>
              <form onSubmit={handleSubmit} className="publication-form">
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
                 <textarea
                  name="patentNumber"
                  placeholder="PatentNumber"
                  value={formData.patentNumber}
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

export default Patents;
