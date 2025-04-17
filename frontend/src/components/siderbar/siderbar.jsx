import React from 'react';
import './siderbar.css';

function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-space">
        {/* Space for logo/image */}
      </div>
      <div className="sidebar-nav">
        <h2 className="sidebar-title">Support for classifying students with depression</h2>
        <div className="sidebar-menu">
          <div className="sidebar-item active">Prediction</div>
          <div className="sidebar-item">History</div>
          <div className="sidebar-item">About</div>
          <div className="sidebar-item">Account Management</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
