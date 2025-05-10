import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/siderbar/siderbar';
import './homepage.css';
import homeLogoImage from '../../assets/home_logo.png';

function HomePage() {
  return (
    <div className="homepage-container">
      <Sidebar />
      <div className="homepage-content">
        <div className="homepage-text-container">
          <h2 className="students-text">S T U D E N T S</h2>
          <h1 className="depression-text">DEPRESSION</h1>
          <h1 className="prediction-text">PREDICTION</h1>
          
          <p className="description-text">
            We understand the invisible pressures students face every day — from academic demands 
            and expectations to loneliness. This platform was created to stand by your side, detect 
            early signs of depression, and provide practical mental health support to help you thrive 
            throughout your academic journey.
          </p>
          
          <Link to="/model-predict" className="predict-now-link">
            <button className="predict-now-button">PREDICT NOW</button>
          </Link>
        </div>
        <div className="homepage-image-container">
          <img src={homeLogoImage} alt="Depression Classification Support" className="home-logo" />
        </div>
      </div>
    </div>
  );
}

export default HomePage; 