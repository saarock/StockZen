import React, { useState } from 'react';
import { FaUtensils, FaPlusCircle, FaUsersCog, FaDeviantart, FaBars, FaTimes } from 'react-icons/fa';
import './AdminDash.css';
import { NavLink } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

const AdminDashBoardNav = () => {
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    { name: 'Add Product', path: 'add-product', icon: <FaUtensils /> }, 
    { name: 'Manage Product', path: 'manage-product', icon: <FaPlusCircle /> },
    { name: 'Manage Users', path: 'manage-users', icon: <FaUsersCog /> },
    { name: 'My details', path: 'my-details', icon: <FaDeviantart /> },
    { name: 'Manage booked product', path: 'manage-booked-product', icon: <FaDeviantart /> },
  ];

  return (
    <div className="dashboard-nav-container">
      {/* Mobile Toggle Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`dashboard-sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="user-info">
          <h2 className="user-name">Welcome, {user?.fullName || 'Admin'}</h2>
        </div>
        <ul className="nav-links">
          {navLinks.map((link, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={link.path}
                className={({ isActive }) => isActive ? 'nav-link activeg' : 'nav-link'}
                onClick={() => {
                  if (window.innerWidth <= 768) setSidebarOpen(false);
                }}
              >
                <span className="icon">{link.icon}</span>
                <span className="link-text">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashBoardNav;
