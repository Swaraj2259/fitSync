import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './SendKudosModal.css';

export default function SendKudosModal({ open, onClose, recipientId, onSent }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { if(open) setMessage(''); }, [open]);

  if (!open) return null;
  return (
    <div className="kudos-modal-overlay">
      <div className="kudos-modal-content">
        <div className="kudos-modal-header">
          <h4>Send Kudos ✨</h4>
          <p>Make someone's day with a nice message!</p>
        </div>
        
        <textarea 
          className="kudos-textarea"
          value={message} 
          onChange={e=>setMessage(e.target.value)} 
          rows={4} 
          placeholder="Write something nice..."
        />
        
        <div className="kudos-actions">
          <button className="kudos-btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="kudos-btn-send"
            disabled={sending}
            onClick={async ()=>{
              if(!message.trim()) return alert('Please write a message');
              setSending(true);
              try {
                await api.post('/kudos', { to: recipientId, message });
                onSent && onSent();
                onClose();
              } catch (err) {
                alert(err.response?.data?.message || 'Failed to send kudos');
              } finally { setSending(false); }
            }}
          >
            {sending ? 'Sending...' : 'Send Kudos'}
          </button>
        </div>
      </div>
    </div>
  );
}