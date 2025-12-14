import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './auth/login';
import HomePage from './pages/Home';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ChallengePage from './pages/ChallengePage';
import TeamView from './pages/TeamView';
import ActivityLog from './pages/ActivityLog';
import Header from './components/Header';
import { useAuth } from './auth/useAuth';
import KudosToast from './components/KudosToast';

export default function App(){
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('dark-mode-body');
    } else {
      document.body.classList.remove('dark-mode-body');
    }
  }, [isHomePage]);

  return (
    <>
      {!isLoginPage && <Header />}
      <KudosToast />
      <main style={(isLoginPage || isHomePage) ? { padding: 0, margin: 0, maxWidth: '100%' } : { padding: '80px 20px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={user ? <HomePage/> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login" />} />
          <Route path="/challenges" element={user ? <Challenges/> : <Navigate to="/login" />} />
          <Route path="/challenges/:id" element={user ? <ChallengePage/> : <Navigate to="/login" />} />
          <Route path="/team" element={user ? <TeamView/> : <Navigate to="/login" />} />
          <Route path="/activities" element={user ? <ActivityLog/> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </>
  );
}