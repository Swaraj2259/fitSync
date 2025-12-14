import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function ActivityLog(){
  const [logs, setLogs] = useState([]);
  const [chMap, setChMap] = useState({});

  useEffect(()=>{
    const load = async () => {
      try {
        const [aRes, cRes] = await Promise.all([
          api.get('/activity'),
          api.get('/challenges')
        ]);
        setLogs(aRes.data || []);
        const map = {};
        (cRes.data || []).forEach(c => map[c._id] = c.title);
        setChMap(map);
      } catch (err) {
        // ignore
      }
    };
    load();
  },[]);
  return (
    <div>
      <h2>My Activity Log</h2>
      <div style={{ display:'grid', gap:12 }}>
        {logs.map(a => (
          <div key={a._id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:700 }}>{chMap[a.challenge] || ('Challenge ' + a.challenge)}</div>
              <div className="small">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:18, fontWeight:700 }}>{a.metric}</div>
              <div className="small">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}