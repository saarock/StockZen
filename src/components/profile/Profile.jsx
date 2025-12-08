import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit3, FiCheck } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    isActive: user?.isActive || false,
    createdAt: user?.createdAt || '',
    updatedAt: user?.updatedAt || '',
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!isAuthenticated) return <div className="not-authenticated">Please log in to view your profile.</div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Updated Profile Data:', formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Your Profile</h1>
        <button className="profile-edit-btn" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
          {isEditing ? <FiCheck /> : <FiEdit3 />}
        </button>
      </div>

      <div className="profile-body">
        <div className="profile-item">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div className="profile-item">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div className="profile-item">
          <label>Account Status:</label>
          <input
            type="text"
            name="isActive"
            value={formData.isActive ? 'Active' : 'Inactive'}
            disabled
          />
        </div>

        <div className="profile-item">
          <label>Member Since:</label>
          <input
            type="text"
            name="createdAt"
            value={new Date(formData.createdAt).toLocaleDateString()}
            disabled
          />
        </div>

        <div className="profile-item">
          <label>Last Updated:</label>
          <input
            type="text"
            name="updatedAt"
            value={new Date(formData.updatedAt).toLocaleDateString()}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
