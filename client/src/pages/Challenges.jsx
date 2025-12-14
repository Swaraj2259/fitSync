// Challenges page
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ChallengeCard from '../components/ChallengeCard';
import CreateChallengeModal from '../components/CreateChallengeModal';
import TourGuide from '../components/TourGuide';
import './challenges.css';

export default function Challenges(){
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [startTour, setStartTour] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const fetchChallenges = () => {
    api.get('/challenges').then(r=>setList(r.data || []));
  };

  useEffect(()=> {
    fetchChallenges();
    const userLocal = JSON.parse(localStorage.getItem('user'));
    if (userLocal) {
        setUserId(userLocal.id || userLocal._id);
    }
  },[]);

  // Stats Calculation
  const now = new Date();
  const activeCount = list.filter(c => new Date(c.startDate) <= now && new Date(c.endDate) >= now).length;
  const upcomingCount = list.filter(c => new Date(c.startDate) > now).length;
  const completedCount = list.filter(c => new Date(c.endDate) < now).length;
  const totalParticipants = list.reduce((acc, curr) => acc + (curr.participants?.length || 0), 0) || 142; // Fallback to mock if no data

  const filteredList = list.filter(c => {
    const start = new Date(c.startDate);
    const end = new Date(c.endDate);
    if (filter === 'active') return start <= now && end >= now;
    if (filter === 'upcoming') return start > now;
    if (filter === 'completed') return end < now;
    return true;
  });

  return (
    <div className="challenges-page">
      <TourGuide userId={userId} start={startTour} onTourEnd={() => setStartTour(false)} />
      <div className="challenges-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div className="challenges-header" style={{ marginBottom: 0, textAlign: 'left' }}>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <h2>Challenges</h2>
            <button onClick={() => setStartTour(true)} style={{padding: '5px 12px', cursor: 'pointer', borderRadius: '15px', border: '1px solid #ddd', background: 'white', fontSize: '0.8rem', color: '#000'}}>Start Tour</button>
          </div>
          <p>Push your limits. Compete with your team. Earn rewards.</p>
        </div>
        <button 
          className="create-challenge-btn"
          onClick={() => setCreateModalOpen(true)}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <span>+</span> Create Challenge
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        <div 
          className={`stat-card ${filter === 'active' ? 'active-filter' : ''}`} 
          onClick={() => setFilter(filter === 'active' ? 'all' : 'active')}
          style={{cursor: 'pointer'}}
        >
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active Challenges</div>
          <div className="stat-bar"><div className="stat-fill" style={{width: '70%'}}></div></div>
        </div>
        <div 
          className={`stat-card ${filter === 'upcoming' ? 'active-filter' : ''}`}
          onClick={() => setFilter(filter === 'upcoming' ? 'all' : 'upcoming')}
          style={{cursor: 'pointer'}}
        >
          <div className="stat-value">{upcomingCount}</div>
          <div className="stat-label">Upcoming</div>
          <div className="stat-bar"><div className="stat-fill" style={{width: '30%'}}></div></div>
        </div>
        <div 
          className={`stat-card ${filter === 'completed' ? 'active-filter' : ''}`}
          onClick={() => setFilter(filter === 'completed' ? 'all' : 'completed')}
          style={{cursor: 'pointer'}}
        >
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
          <div className="stat-bar"><div className="stat-fill" style={{width: '90%'}}></div></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalParticipants}</div>
          <div className="stat-label">Total Participants</div>
          <div className="stat-bar"><div className="stat-fill" style={{width: '50%'}}></div></div>
        </div>
      </div>
      
      <div className="challenges-grid">
        {filteredList.map(c => <ChallengeCard key={c._id} challenge={c} />)}
      </div>

      <CreateChallengeModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchChallenges}
      />
    </div>
  );
}