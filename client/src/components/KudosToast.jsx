// KudosToast component
import React, { useEffect, useState } from 'react';
import { getSocket } from '../sockets/socket';
import './KudosToast.css';

export default function KudosToast(){
  const [kudos, setKudos] = useState(null);

  useEffect(()=>{
    const s = getSocket();
    if (!s) return;
    const handler = (payload) => {
      setKudos(payload);
      setTimeout(()=> setKudos(null), 6000);
    };
    s.on('kudosReceived', handler);
    return ()=> s.off('kudosReceived', handler);
  },[]);

  if (!kudos) return null;
  return (
    <div className="kudos-toast">
      <div className="kudos-toast-title">
        <span>🎉</span> Kudos Received!
      </div>
      <div className="kudos-toast-msg">{kudos.message}</div>
      <div className="kudos-toast-from">From: {kudos.from?.name || 'A Teammate'}</div>
    </div>
  );
}