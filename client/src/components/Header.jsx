// Header component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './header.css';
import './header-dashboard.css';

export default function Header(){
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className={`app-header ${isHome ? 'header-transparent' : 'header-solid'} ${isDashboard ? 'header-dashboard-glass' : ''}`}>
      <div className="header-container">
        <Link to="/" className="header-logo">FitSync</Link>
        
        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/challenges" className="nav-link">Challenges</Link>
          <Link to="/team" className="nav-link">Team</Link>
          <Link to="/activities" className="nav-link">My Activity</Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}