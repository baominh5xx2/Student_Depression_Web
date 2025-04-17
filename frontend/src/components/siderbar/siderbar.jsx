import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './siderbar.css';

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-space">
        {/* Space for logo/image */}
      </div>
      <div className="sidebar-nav">
        <h2 className="sidebar-title">Support for classifying students with depression</h2>
        <div className="sidebar-menu">
          <Link to="/model-predict" className="sidebar-item-link">
            <div className={`sidebar-item ${currentPath === '/model-predict' ? 'active' : ''}`}>
              Prediction
            </div>
          </Link>
          <Link to="/history" className="sidebar-item-link">
            <div className={`sidebar-item ${currentPath === '/history' ? 'active' : ''}`}>
              History
            </div>
          </Link>
          <div className="sidebar-item">About</div>
          <div className="sidebar-item">Account Management</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
