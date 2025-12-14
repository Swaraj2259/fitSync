import React from 'react';

export default function Leaderboard({ data = [] }){
  return (
    <div className="leaderboard">
      {data.length === 0 && <div className="small">No data</div>}
      {data.map((row, idx) => {
        const name = row.user?.name || row._id;
        return (
          <div key={row._id || idx} className="lb-row">
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div className="lb-rank">{idx+1}</div>
              <div>
                <div style={{ fontWeight:700 }}>{name}</div>
                <div className="small">{row.user?.email}</div>
              </div>
            </div>
            <div style={{ fontWeight:700 }}>{row.total}</div>
          </div>
        );
      })}
    </div>
  );
}