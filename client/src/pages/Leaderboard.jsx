
useEffect(()=> {
  const socket = getSocket();
  socket?.on('leaderboardUpdate', setLeaderboard);
  return ()=> socket?.off('leaderboardUpdate');
}, []);
