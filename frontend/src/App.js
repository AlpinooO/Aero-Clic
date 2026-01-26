import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import MiniGameLobby from './components/MiniGameLobby';
import ClickGame from './components/ClickGame';
import GripRushGame from './components/GripRushGame';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import './App.css';
import BeatGame from './components/BeatGame';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/minigame" element={<MiniGameLobby />} />
          <Route path="/minigame/click" element={<ClickGame />} />
          <Route path="/minigame/griprush" element={<GripRushGame />} />
          <Route path="/minigame/beatpulse" element={<BeatGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
