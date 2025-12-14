import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { getSocket } from '../sockets/socket';
import Leaderboard from '../components/Leaderboard';
import ActivityForm from '../components/ActivityForm';

export default function ChallengePage(){
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(()=>{
    api.get(`/challenges`).then(r => {
      const found = (r.data || []).find(x => x._id === id);
      setChallenge(found);
    });
  },[id]);

  useEffect(()=>{
    const s = getSocket();
    if (!s) return;
    s.emit('joinChallenge', id);

    const handler = (payload) => {
      if(payload.challengeId === id) setLeaderboard(payload.leaderboard || []);
    };
    s.on('leaderboardUpdate', handler);
    // request initial leaderboard from API
    api.get(`/activity/leaderboard?challengeId=${id}`).then(r => setLeaderboard(r.data || [])).catch(()=>{});
    return ()=> {
      s.emit('leaveChallenge', id);
      s.off('leaderboardUpdate', handler);
    };
  },[id]);

  return (
    <div>
      <h2>{challenge?.title || 'Challenge'}</h2>
      <div>{challenge?.description}</div>
      <div style={{ marginTop: 16 }}>
        <h3>Leaderboard</h3>
        <Leaderboard data={leaderboard} />
      </div>
      <div style={{ marginTop: 16 }}>
  <h3>Log Activity</h3>
  <ActivityForm 
    challengeId={id} 
    defaultUnit={challenge?.targetMetric}
    onLogged={() => {
    // optionally fetch leaderboard or trust real-time update
  }} />
</div>
    </div>
  );
}