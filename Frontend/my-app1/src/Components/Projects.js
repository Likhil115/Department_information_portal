import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const Projects = ({ user }) => {
  const [projects, setData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', lead: '', year: '', description: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState(''); // Filter state

  useEffect(() => {
    axios
      .get('/api/projects') // Adjust URL if needed
      .then(response => {
        setData(response.data); // Store data in state
        setFilteredProjects(response.data); // Set filtered data initially as all projects
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: '', lead: '', year: '', description: '', url: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    // Validate title
    if (formData.title.trim().length < 5 || formData.title.trim().length > 100) {
      setError('Title must be between 5 and 100 characters.');
      return;
    }

    // Validate lead
    if (formData.lead.trim().length < 3 || formData.lead.trim().length > 50) {
      setError('Lead must be between 3 and 50 characters.');
      return;
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (
      isNaN(formData.year) ||
      formData.year < 1900 ||
      formData.year > currentYear
    ) {
      setError(`Year must be a valid number between 1900 and ${currentYear}.`);
      return;
    }

    // Validate description
    if (formData.description.trim().length < 10 || formData.description.trim().length > 500) {
      setError('Description must be between 10 and 500 characters.');
      return;
    }

    // Validate URL
    const urlPattern = /^(https?:\/\/)/;
    if (!urlPattern.test(formData.url)) {
      setError('URL must start with http:// or https://.');
      return;
    }

    setLoading(true); // Start loading state
    try {
      const projectdata = isEditing
        ? { ...formData }
        : { ...formData, createdBy: user._id };

      const response = isEditing
        ? await axios.put(`/api/projects/${editData._id}`, projectdata)
        : await axios.post('/api/projects', projectdata);

      if (isEditing) {
        setData(projects.map(pub => pub._id === editData._id ? response.data : pub));
      } else {
        setData([...projects, response.data]);
      }
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      setData(projects.filter(pub => pub._id !== id));
      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setEditData(project);
    setFormData({ ...project });
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const query = e.target.value.toLowerCase();
    setFilter(query);

    if (query) {
      const filtered = projects.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.lead.toLowerCase().includes(query) ||
        project.year.toString().includes(query)
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects); // If no filter, show all projects
    }
  };

  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>
      <p className="projects-subtitle">Explore our innovative projects and initiatives</p>

      {/* Filter input */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by title, lead, or year"
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      {/* Add New Project Button */}
      {user &&  (
        <motion.button
          onClick={openModal}
          className="add-publication-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Add New Project
        </motion.button>
      )}

      {/* Project Cards */}
      <div className="projects-card-container">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            className="project-card"
            whileHover={{ rotate: 3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <h2 className="project-title">{project.title}</h2>
            <p className="project-lead"><strong>Lead:</strong> {project.lead}</p>
            <p className="project-year"><strong>Year:</strong> {project.year}</p>
            <p className="project-description">{project.description}</p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View Project
            </a>
            {user && project && (String(user._id) === String(project.createdBy) || user.userType === 'admin') && (
              <div className="action-buttons-inline">
                <motion.button
                  onClick={() => handleEdit(project)}
                  className="edit-button-inline"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(project._id)}
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

      {/* Modal */}
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
              <h2>{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
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
                  type="text"
                  name="lead"
                  placeholder="Lead"
                  value={formData.lead}
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
                  placeholder="Provide link to your project"
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

export default Projects;
