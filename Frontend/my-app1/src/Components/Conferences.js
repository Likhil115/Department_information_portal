import { motion, AnimatePresence } from 'framer-motion';
import './Conferences.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Conferences = ({ user }) => {
  const [conferences, setData] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    description: '',
    url: ''
  });
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('/api/conferences') // Adjust URL if needed
      .then(response => {
        setData(response.data); // Store data in state
        setFilteredConferences(response.data); // Initialize with all conferences
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: '', location: '', date: '', description: '', url: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter conferences based on search query
    const filtered = conferences.filter((conf) => {
      return (
        conf.title.toLowerCase().includes(query) ||
        conf.location.toLowerCase().includes(query) ||
        conf.date.toLowerCase().includes(query)
      );
    });

    setFilteredConferences(filtered);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for URL
    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/gm;
    if (formData.url && !urlPattern.test(formData.url)) {
        alert("Please enter a valid URL.");
        return;
    }

    // Validation to ensure the date is not in the past
    if (new Date(formData.date) < new Date()) {
        alert("Please enter a valid future date.");
        return;
    }

    try {
        const conferenceData = isEditing
            ? { ...formData }
            : { ...formData, createdBy: user._id };

        const response = isEditing
            ? await axios.put(`/api/conferences/${editData._id}`, conferenceData)
            : await axios.post('/api/conferences', conferenceData);

        if (isEditing) {
            setData(conferences.map(conf => conf._id === editData._id ? response.data : conf));
            setFilteredConferences(filteredConferences.map(conf => conf._id === editData._id ? response.data : conf));
        } else {
            setData([...conferences, response.data]);
            setFilteredConferences([...filteredConferences, response.data]);
        }

        closeModal();
    } catch (error) {
        console.error("Error saving conference:", error);
    }
};


  // Delete conference
  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this conference?");
      if (!confirmed) return;

      await axios.delete(`/api/conferences/${id}`);
      setData(conferences.filter(conf => conf._id !== id));
      setFilteredConferences(filteredConferences.filter(conf => conf._id !== id));
    } catch (error) {
      console.error("Error deleting conference:", error);
    }
  };

  // Open edit modal with existing data
  const handleEdit = (conference) => {
    setIsEditing(true);
    setEditData(conference);
    setFormData({ ...conference });
    setIsModalOpen(true);
  };

  return (
    <div className="conferences-page">
      <div className="parallax-background">
        <h1 className="page-title2">Conferences</h1>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search conferences..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="conferences-container">
        <p className="page-subtitle2">Join us at upcoming events around the world</p>

        {user && (user.userType==="admin" || user.userType==="staff") && (
          <motion.button
            onClick={openModal}
            className="add-conference-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? 'Edit Conference' : 'Add New Conference'}
          </motion.button>
        )}

        <div className="conferences-grid">
        {filteredConferences.map((conf, index) => (
    <motion.div
      key={index}
      className="conference-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.2 }}
      whileHover={{ scale: 1.1 }}
    >
      <h2 className="conference-title">{conf.title}</h2>
      <p className="conference-location">{conf.location}</p>
      <p className="conference-date">{conf.date}</p>
      <p className="conference-description">{conf.description}</p>
      <a 
        href={conf.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="conference-link"
      >
        More Details
      </a>
      {user && conf && (String(user._id) === String(conf.createdBy) || user.userType==="admin") && (
        <div className="action-buttons">
          <motion.button
            onClick={() => handleEdit(conf)}
            className="action-button edit-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Edit
          </motion.button>
          <motion.button
            onClick={() => handleDelete(conf._id)}
            className="action-button delete-button"
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
              <h2>{isEditing ? 'Edit Conference' : 'Add New Conference'}</h2>
              <form onSubmit={handleSubmit} className="conference-form">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={formData.date}
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

export default Conferences;
