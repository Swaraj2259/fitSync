import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import RetroGridBackground from '../components/RetroGridBackground';
import './dashboard.css';
import './motivation.css';
import './stats.css';

export default function Dashboard(){
  const [challenges, setChallenges] = useState([]);
  const [kudos, setKudos] = useState([]);
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(()=>{
    const fetch = async ()=>{
      try {
        const userLocal = JSON.parse(localStorage.getItem('user'));
        const userId = userLocal?.id || userLocal?._id;
        
        const [cRes, kRes, uRes, sRes] = await Promise.all([
          api.get('/challenges'),
          api.get('/kudos/my'),
          userId ? api.get(`/users/${userId}`) : Promise.resolve({data: userLocal}),
          api.get('/activity/stats')
        ]);
        
        setChallenges(cRes.data || []);
        setKudos(kRes.data || []);
        setMe(uRes.data || userLocal);
        setStats(sRes.data || []);
        
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  },[]);

  const getMotivation = (points) => {
    if (!points) return { title: "Let's Get Started!", msg: "Every journey begins with a single step. Log your first activity today!", icon: "🌱" };
    if (points < 3000) return { title: "Keep Going!", msg: "You're building a great habit. Consistency is the key to success.", icon: "🚀" };
    if (points < 7000) return { title: "You're on Fire!", msg: "Amazing progress! You're crushing your goals.", icon: "🔥" };
    return { title: "Legendary Status", msg: "You are an inspiration to the whole team!", icon: "👑" };
  };

  const motivation = getMotivation(me?.totalPoints);

  return (
    <div className="dashboard-container">
      <RetroGridBackground />
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-welcome">
          Welcome back, <strong>{me?.name}</strong>! You have <strong>{me?.totalPoints || 0}</strong> points.
        </div>
      </div>

      {/* Motivation Banner */}
      <div className="motivation-banner">
        <div className="motivation-icon">{motivation.icon}</div>
        <div className="motivation-content">
          <h4>{motivation.title}</h4>
          <p>{motivation.msg}</p>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="section-title">
        <span>📈</span> Your Progress (Last 7 Days)
      </div>
      <div className="chart-container" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#ccc', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#ccc', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.8)', color: '#fff' }}
              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
            />
            <Line 
              type="monotone" 
              dataKey="points" 
              stroke="#fff" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Challenges & Badges */}
        <div>
          {/* Badges Section */}
          <div className="section-title">
            <span>🏆</span> Your Badges
          </div>
          <div className="badges-container">
            {me?.badges && me.badges.length > 0 ? (
              me.badges.map((b, i) => (
                <div key={i} className="badge-item">
                  <div className="badge-icon">{b.icon}</div>
                  <div className="badge-name">{b.name}</div>
                </div>
              ))
            ) : (
              <div className="no-badges">No badges yet. Keep logging activities to earn them!</div>
            )}
          </div>

          <div className="section-title">
            <span>🔥</span> Active Challenges
          </div>
          <div className="card-list">
            {challenges.length === 0 ? (
              <div className="empty-state">No active challenges found.</div>
            ) : (
              challenges.map(c => (
                <Link key={c._id} to={`/challenges/${c._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="challenge-card-dash">
                    <h4>{c.title}</h4>
                    <p>{c.description}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div style={{ marginTop:20 }}>
            <Link to="/challenges" className="btn-link">See all challenges →</Link>
          </div>
        </div>

        {/* Right Column: Kudos */}
        <div>
          <div className="section-title">
            <span>✨</span> Recent Kudos
          </div>
          <div className="kudos-list">
            {kudos.length === 0 ? (
              <div className="empty-state">No kudos received yet. Do something awesome!</div>
            ) : (
              kudos.map(k => (
                <div key={k._id} className="kudos-item">
                  <div className="kudos-msg">"{k.message}"</div>
                  <div className="kudos-meta">
                    <span>From: {k.from?.name || 'Unknown'}</span>
                    <span>{new Date(k.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}