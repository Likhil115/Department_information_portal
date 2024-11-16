import { motion, AnimatePresence } from 'framer-motion';
import './Publications.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Publications = ({ user }) => {
  const [publications, setPublications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', authors: '', year: '', description: '', url: '' });
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    axios.get('/api/publications')
      .then((response) => setPublications(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: '', authors: '', year: '', description: '', url: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const publicationData = isEditing
        ? { ...formData }
        : { ...formData, createdBy: user._id };

      const response = isEditing
        ? await axios.put(`/api/publications/${editData._id}`, publicationData)
        : await axios.post('/api/publications', publicationData);

      if (isEditing) {
        setPublications(publications.map((pub) => (pub._id === editData._id ? response.data : pub)));
      } else {
        setPublications([...publications, response.data]);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving publication:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this publication?");
      if (!confirmed) return;

      await axios.delete(`/api/publications/${id}`);
      setPublications(publications.filter((pub) => pub._id !== id));
    } catch (error) {
      console.error("Error deleting publication:", error);
    }
  };

  const handleEdit = (publication) => {
    setIsEditing(true);
    setEditData(publication);
    setFormData({ ...publication });
    setIsModalOpen(true);
  };

  return (
    <div className="publications-container">
      <h1 className="publications-title">Publications</h1>
      <p className="publications-subtitle">Discover our recent research and publications</p>

      {user && (
        <motion.button
          onClick={openModal}
          className="add-publication-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Add New Publication
        </motion.button>
      )}

      <div className="publications-card-container">
        {publications.map((pub) => (
          <motion.div
            key={pub._id}
            className="publication-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="publication-title">{pub.title}</h2>
            <p className="publication-authors"><strong>Authors:</strong> {pub.authors}</p>
            <p className="publication-year"><strong>Year:</strong> {pub.year}</p>
            <p className="publication-description">{pub.description}</p>
            <a href={pub.url} target="_blank" rel="noopener noreferrer" className="publication-link">Read More</a>
            {user && pub && (String(user._id) === String(pub.createdBy) || String(user._id) === "67268769c54d481cc698dd3a") && (
              <div className="action-buttons-inline">
                <motion.button
                  onClick={() => handleEdit(pub)}
                  className="edit-button-inline"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(pub._id)}
                  className="delete-button-inline"
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
                <input
                  type="text"
                  name="authors"
                  placeholder="Authors"
                  value={formData.authors}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  value={formData.year}
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

export default Publications;
