// client/src/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import heroVideo from '../assest/hero-bg.mp4';
import './login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@fit.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-screen">
      {/* Left Side: Visual/Brand */}
      <div className="login-visual-side">
        <video autoPlay loop muted playsInline className="login-video-bg">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="login-video-overlay"></div>
        <div className="visual-content">
          <h1>FitSync</h1>
          <p>Redefining Corporate Wellness.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="login-form-side">
        <div className="form-container">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={submit} className="modern-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn-black" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="form-footer">
              <p>Don't have an account? <a href="#">Contact Admin</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}