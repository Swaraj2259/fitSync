import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Login(){
  const [email,setEmail] = useState('admin@fit.com');
  const [password,setPassword] = useState('password123');
  const [err,setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try{
      await login(email, password);
      nav('/');
    }catch(err){
      console.error(err);
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handle}>
        <div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        </div>
        <div style={{ marginTop: 8 }}>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
        </div>
        {err && <div style={{ color:'red', marginTop:8 }}>{err}</div>}
      </form>
    </div>
  );
}