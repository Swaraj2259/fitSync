import React from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../assest/hero-bg.mp4';
import './home.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Elevate Wellness. <br />
            <span className="text-gradient">Empower Teams.</span>
          </h1>
          <p className="hero-sub">
            Boost employee health, productivity, and teamwork with FitSync's 
            real-time challenges and corporate wellness programs.
          </p>
          <div className="hero-cta-container">
            <Link to="/challenges" className="cta-button">
              Start Your Wellness Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stats-card">
            <h3 className="stats-number">5K</h3>
            <p className="stats-label">Employees Engaged</p>
          </div>
          <div className="stats-card">
            <h3 className="stats-number">200+</h3>
            <p className="stats-label">Active Challenges Logged</p>
          </div>
          <div className="stats-card">
            <h3 className="stats-number">1M</h3>
            <p className="stats-label">Total Steps Tracked</p>
          </div>
          <div className="stats-card">
            <h3 className="stats-number">10K</h3>
            <p className="stats-label">Kudos Shared</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
