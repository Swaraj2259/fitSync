import React from 'react';

const LeaderboardCard = () => {
  return (
    <div className="leaderboard-card">
      <h3>Top Users</h3>
      {/* Map through users and display rank */}
      <p>Rank 1: User A</p>
      <p>Rank 2: User B</p>
    </div>
  );
};

export default LeaderboardCard;
