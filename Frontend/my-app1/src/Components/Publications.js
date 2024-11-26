import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Publications.css";

const Publications = ({ user }) => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", authors: "", year: "", description: "", url: "" });
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/publications")
      .then((response) => {
        setPublications(response.data);
        setFilteredPublications(response.data);
      })
      .catch((error) => console.error("Error fetching publications:", error));
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = publications.filter(
      (pub) =>
        pub.title.toLowerCase().includes(value) ||
        pub.authors.toLowerCase().includes(value) ||
        String(pub.year).includes(value)
    );
    setFilteredPublications(filtered);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ title: "", authors: "", year: "", description: "", url: "" });
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
        : await axios.post("/api/publications", publicationData);

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
      const updatedPublications = publications.filter((pub) => pub._id !== id);
      setPublications(updatedPublications);
      setFilteredPublications(updatedPublications);
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
      <p className="publications-subtitle">Explore recent research and studies</p>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Search by title, authors, or year"
        className="filter-input"
        value={searchTerm}
        onChange={handleFilterChange}
      />

      {/* Add Publication Button */}
      {user  &&(
        <button className="add-publication-button" onClick={openModal}>
          Add New Publication
        </button>
      )}

      {/* Publication List */}
      <div className="publications-list">
        {filteredPublications.map((pub) => (
          <div key={pub._id} className="publication-entry">
            <div className="publication-header">
              <h2 className="publication-title">{pub.title}</h2>
              <span className="publication-year">{pub.year}</span>
            </div>
            <div className="publication-body">
              <p>
                <strong>Authors:</strong> {pub.authors}
              </p>
              <p>
                <strong>Description:</strong> {pub.description}
              </p>
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="publication-link"
              >
                Read More
              </a>
              {user &&
                (String(user._id) === String(pub.createdBy) ||
                  user.userType==="admin") && (
                  <div className="publication-actions">
                    <button
                      onClick={() => handleEdit(pub)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pub._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Publication" : "Add New Publication"}</h2>
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
              <button type="submit" className="submit-button">
                {isEditing ? "Update" : "Submit"}
              </button>
              <button type="button" className="close-button" onClick={closeModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publications;
