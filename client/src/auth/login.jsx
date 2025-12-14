// client/src/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import heroVideo from '../assest/hero-bg.mp4';
import './login.css';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
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
            <h2>{isRegister ? 'Create Account' : 'Welcome back'}</h2>
            <p>{isRegister ? 'Enter your details to get started.' : 'Please enter your details to sign in.'}</p>
          </div>

          <form onSubmit={submit} className="modern-form">
            {isRegister && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

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

            {!isRegister && (
              <div className="form-actions">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn-black" disabled={loading}>
              {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign in')}
            </button>

            <div className="form-footer">
              <p>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>
                  {isRegister ? 'Sign in' : 'Sign up'}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}