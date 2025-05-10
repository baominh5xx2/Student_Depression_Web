import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './siderbar.css';
import csLogo from '../../assets/cs_logo.png';
import uitLogo from '../../assets/UIT.jpg';

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-space">
        <div className="sidebar-logos">
          <img src={csLogo} alt="CS Logo" className="sidebar-logo" />
          <img src={uitLogo} alt="UIT Logo" className="sidebar-logo" />
        </div>
      </div>
      <div className="sidebar-nav">
        <h2 className="sidebar-title">SUPPORT CLASSIFY DEPRESSION FOR STUDENTS</h2>
        <div className="sidebar-menu">
          <Link to="/home" className="sidebar-item-link">
            <div className={`sidebar-item ${currentPath === '/home' ? 'active' : ''}`}>
              Home
            </div>
          </Link>
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
          <Link to="/about" className="sidebar-item-link">
            <div className={`sidebar-item ${currentPath === '/about' ? 'active' : ''}`}>
              About
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
