import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Patents.css';

const Patents = ({ user }) => {
  const [patents, setPatents] = useState([]);
  const [filteredPatents, setFilteredPatents] = useState([]); // For displaying filtered results
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    patentNumber: '',
    url: '',
  });
  const [editData, setEditData] = useState(null); // New state for tracking data to edit

  useEffect(() => {
    axios
      .get('/api/patents') // Adjust URL if needed
      .then((response) => {
        setPatents(response.data); // Store data in state
        setFilteredPatents(response.data); // Initialize filtered results
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Filter patents based on the search term
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = patents.filter((patent) =>
      patent.title.toLowerCase().includes(value.toLowerCase()) ||
      patent.patentNumber.toLowerCase().includes(value.toLowerCase()) ||
      (user &&
        patent.createdBy &&
        String(user._id) === String(patent.createdBy) &&
        'Your Patents'.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredPatents(filtered);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: '', description: '', patentNumber: '', url: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patentNumberPattern = /^IN\d{6,7}$/;
    if (!patentNumberPattern.test(formData.patentNumber)) {
        alert("Please enter a valid patent number (e.g., IN123456)");
        return;  // Stop form submission if patent number is invalid
    }
    try {
      const patentData = isEditing
        ? { ...formData }
        : { ...formData, createdBy: user._id }; // Associate user ID

      const response = isEditing
        ? await axios.put(`/api/patents/${editData._id}`, patentData)
        : await axios.post('/api/patents', patentData);

      if (isEditing) {
        setPatents(
          patents.map((pub) =>
            pub._id === editData._id ? response.data : pub
          )
        );
      } else {
        setPatents([...patents, response.data]);
      }

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error saving patent:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(
        'Are you sure you want to delete this patent?'
      );
      if (!confirmed) return;

      await axios.delete(`/api/patents/${id}`);
      setPatents(patents.filter((pub) => pub._id !== id));
      window.location.reload();
    } catch (error) {
      console.error('Error deleting patent:', error);
    }
  };

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

      {/* Search Bar for Filtering */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search by title or patent number"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {user &&
        (user.userType === 'staff' || user.userType === 'admin') && (
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
        {filteredPatents.map((patent, index) => (
          <motion.div
            key={index}
            className="patent-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h2 className="patent-title">{patent.title}</h2>
            <p className="patent-description">{patent.description}</p>
            <p className="patent-number">
              Patent Number: {patent.patentNumber}
            </p>
            <a
              href={patent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="patent-link"
            >
              Learn More
            </a>
            {user &&
              patent &&
              (String(user._id) === String(patent.createdBy) ||
                String(user._id) === '67268769c54d481cc698dd3a') && (
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

      {/* Modal Implementation (Unchanged) */}
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
              initial={{ y: '-100vh' }}
              animate={{ y: 0 }}
              exit={{ y: '100vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{isEditing ? 'Edit Patent' : 'Add New Patent'}</h2>
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
                <input
                  type="text"
                  name="patentNumber"
                  placeholder="Patent Number"
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
