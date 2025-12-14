import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './ActivityForm.css';

export default function ActivityForm({ challengeId, onLogged, defaultUnit }) {
  const [metric, setMetric] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('points');

  useEffect(() => { 
    if (defaultUnit) setUnit(defaultUnit);
  }, [defaultUnit]);

  const submit = async (e) => {
    e.preventDefault();
    const m = Number(metric);
    if (!m || m <= 0) return alert('Enter a positive number');
    setLoading(true);
    try {
      await api.post('/activity', { challengeId, metric: m, unit }); // Pass unit if backend supports it, otherwise it's just metric
      setMetric('');
      onLogged && onLogged();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form-container">
      <div className="activity-form-label">Log New Activity</div>
      <form onSubmit={submit} className="activity-form-row">
        <div className="activity-input-group">
          <input
            className="activity-input"
            value={metric}
            onChange={e => setMetric(e.target.value)}
            placeholder="Amount"
            inputMode="decimal"
            type="number"
            step="any"
          />
        </div>
        
        <select 
          className="activity-select"
          value={unit} 
          onChange={e=>setUnit(e.target.value)}
        >
          <optgroup label="General">
            <option value="points">Points</option>
            <option value="steps">Steps</option>
            <option value="reps">Reps</option>
            <option value="sets">Sets</option>
          </optgroup>
          <optgroup label="Distance">
            <option value="km">Kilometers (km)</option>
            <option value="mi">Miles (mi)</option>
            <option value="m">Meters (m)</option>
          </optgroup>
          <optgroup label="Time">
            <option value="mins">Minutes</option>
            <option value="hours">Hours</option>
          </optgroup>
          <optgroup label="Weight/Other">
            <option value="cal">Calories</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
          </optgroup>
        </select>
        
        <button type="submit" className="activity-btn" disabled={loading}>
          {loading ? 'Logging...' : 'Log Activity'}
        </button>
      </form>
    </div>
  );
}