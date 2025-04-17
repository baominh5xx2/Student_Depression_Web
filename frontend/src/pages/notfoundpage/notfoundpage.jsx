import React from 'react';
import { Link } from 'react-router-dom';
import './notfoundpage.css';
import Sidebar from '../../components/siderbar/siderbar';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Sidebar />
      <div className="not-found-content">
        <div className="not-found-container">
          <div className="error-code">404</div>
          <div className="error-divider"></div>
          <div className="error-text">
            <h1>Page Not Found</h1>
            <p>Oops! The page you are looking for doesn't exist or has been moved.</p>
            <div className="error-actions">
              <Link to="/model-predict" className="back-home-btn">
                Back to Home
              </Link>
              <Link to="/history" className="view-history-btn">
                View History
              </Link>
            </div>
          </div>
        </div>
        
        <div className="error-illustration">
          <div className="error-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
            <div className="circle circle-4"></div>
            <div className="circle circle-5"></div>
          </div>
          <div className="lost-person">
            <div className="person-head"></div>
            <div className="person-body"></div>
            <div className="person-legs"></div>
          </div>
          <div className="map-pins">
            <div className="map-pin pin-1"></div>
            <div className="map-pin pin-2"></div>
            <div className="map-pin pin-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
