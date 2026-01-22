import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MiniGame1.css';

function MiniGame() {
  const { user } = useAuth();

  return (
    <div className="minigame-container">
      <nav className="navbar">
        <div className="logo-container">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>AÉRO</span>
            <span style={{ color: '#76ff03' }}>CLIC</span>
            <span style={{ fontSize: '1.5rem', marginLeft: '5px' }}>🖱️</span>
          </Link>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/minigame" className="nav-link active">Mini Jeu</Link>
          <span className="nav-link">Profil</span>
        </div>
      </nav>

      <div className="minigame-content">
        <div className="minigame-header">
          <h1>🎮 Mini Jeu</h1>
          {user && <p className="welcome-message">Bienvenue, {user.username} !</p>}
        </div>

        <div className="game-placeholder">
          <div className="placeholder-icon">🎯</div>
          <h2>Zone de jeu</h2>
          <p>Le mini jeu sera ajouté ici prochainement...</p>
          <div className="placeholder-features">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Entraînement rapide</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span>Scores et classements</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span>Interface interactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniGame;
