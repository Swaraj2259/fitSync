import React, { useEffect, useState } from 'react';
import api from '../api/api';
import SendKudosModal from '../components/SendKudosModal';
import './team.css';

export default function TeamView(){
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [to, setTo] = useState(null);

  const fetchTeam = () => {
    api.get('/users').then(r => {
      const data = r.data || [];
      // Sort by points descending for leaderboard logic
      const sorted = data.sort((a,b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setTeam(sorted);
    }).catch(()=>setTeam([]));
  };

  useEffect(()=> {
    fetchTeam();
  },[]);

  useEffect(() => {
    if (!search) {
      setFilteredTeam(team);
    } else {
      const lower = search.toLowerCase();
      setFilteredTeam(team.filter(u => 
        u.name.toLowerCase().includes(lower) || 
        u.email.toLowerCase().includes(lower)
      ));
    }
  }, [search, team]);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '??';
  };

  // Top 3 for Podium
  const top3 = team.slice(0, 3);

  return (
    <div className="team-page">
      <div className="team-header">
        <h2>Team Leaderboard</h2>
        <p>Celebrate success and cheer for your teammates.</p>
      </div>

      {/* Search Bar */}
      <div className="team-search-container">
        <input 
          type="text" 
          placeholder="Search team members..." 
          className="team-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Podium Section (Only show if no search active) */}
      {!search && team.length >= 3 && (
        <div className="top-performers">
          {/* Rank 2 */}
          <div className="podium-spot podium-rank-2">
            <div className="podium-avatar">
              {getInitials(top3[1].name)}
            </div>
            <div className="podium-name">{top3[1].name}</div>
            <div className="podium-points">{top3[1].totalPoints} pts</div>
            <div className="podium-bar">2</div>
          </div>
          
          {/* Rank 1 */}
          <div className="podium-spot podium-rank-1">
            <div className="crown-icon">👑</div>
            <div className="podium-avatar">
              {getInitials(top3[0].name)}
            </div>
            <div className="podium-name">{top3[0].name}</div>
            <div className="podium-points">{top3[0].totalPoints} pts</div>
            <div className="podium-bar">1</div>
          </div>

          {/* Rank 3 */}
          <div className="podium-spot podium-rank-3">
            <div className="podium-avatar">
              {getInitials(top3[2].name)}
            </div>
            <div className="podium-name">{top3[2].name}</div>
            <div className="podium-points">{top3[2].totalPoints} pts</div>
            <div className="podium-bar">3</div>
          </div>
        </div>
      )}

      {/* Team Grid */}
      <div className="team-grid">
        {filteredTeam.map(u => (
          <div key={u._id} className="team-card">
            <div className="member-avatar">
              {getInitials(u.name)}
            </div>
            <div className="member-info">
              <h3>{u.name}</h3>
              <div className="member-email">{u.email}</div>
            </div>
            
            <div className="member-stats">
              <div className="stat-item">
                <span className="stat-val">{u.totalPoints || 0}</span>
                <span className="stat-lbl">Points</span>
              </div>
              {/* Placeholder for other stats if available */}
            </div>

            <button 
              className="kudos-btn"
              onClick={() => { setTo(u._id); setModalOpen(true); }}
            >
              Send Kudos ✨
            </button>
          </div>
        ))}
      </div>

      <SendKudosModal 
        open={modalOpen} 
        onClose={()=>setModalOpen(false)} 
        recipientId={to} 
        onSent={fetchTeam} 
      />
    </div>
  );
}