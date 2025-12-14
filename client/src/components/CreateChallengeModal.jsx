import React, { useState } from 'react';
import api from '../api/api';
import './CreateChallengeModal.css';

export default function CreateChallengeModal({ open, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    targetMetric: 'steps'
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      return alert('Please fill in all required fields');
    }

    setLoading(true);
    try {
      await api.post('/challenges', formData);
      onCreated && onCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        targetMetric: 'steps'
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-challenge-overlay">
      <div className="create-challenge-content">
        <div className="create-challenge-header">
          <h3>Create New Challenge</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Challenge Title *</label>
            <input 
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 30-Day Step Challenge"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this challenge about?"
            />
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label>Start Date *</label>
              <input 
                type="date"
                className="form-input"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End Date *</label>
              <input 
                type="date"
                className="form-input"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Target Metric</label>
            <select 
              className="form-select"
              name="targetMetric"
              value={formData.targetMetric}
              onChange={handleChange}
            >
              <option value="steps">Steps</option>
              <option value="points">Points</option>
              <option value="km">Kilometers (km)</option>
              <option value="mins">Minutes</option>
              <option value="cal">Calories</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
