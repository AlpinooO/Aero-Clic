import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MiniGameLobby.css';

function MiniGameLobby() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      alert(`Prêt à jouer, ${user.username} !`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo-container">
          <span>AÉRO</span>
          <span style={{ color: '#76ff03' }}>CLIC</span>
          <span style={{ fontSize: '1.5rem', marginLeft: '5px' }}>🖱️</span>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <span className="nav-link" onClick={handleAction}>S'entrainer</span>
          <Link to="/minigame" className="nav-link">Minijeux</Link>
          <span className="nav-link">Profil</span>
          
          {user ? (
            <button 
              onClick={logout} 
              className="btn-primary" 
              style={{ backgroundColor: '#d32f2f' }}
            >
              Se déconnecter
            </button>
          ) : (
            <Link to="/login" className="btn-primary">
              Se connecter
            </Link>
          )}
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text-box">
            <h1 className="welcome-text">Mini Jeu !</h1>
            <p className="hero-description">
              Teste tes réflexes et ta précision dans ce mini-jeu de clics !
            </p>
            <p className="hero-description">
              Plus tu cliques vite et précisément, plus tu accumules de points
            </p>
          </div>
        </div>
        <div className="hero-image-container">
        </div>
      </div>

      <div className="minigames-section">
        <div className="game-card">
          <div className="game-image click-game">
            <img src="" alt="Clic" />
          </div>
          <h3 className="game-title">Clic</h3>
          <p className="game-description">
            Clique de façon régulière sur la souris en suivant le temps comme un métronome, en frappant la précision.
          </p>
        </div>

        <div className="game-card">
          <div className="game-image drag-drop-game">
            <img src="" alt="Drag and Drop" />
          </div>
          <h3 className="game-title">Drag and Drop</h3>
          <p className="game-description">
            Utilise le drag and drop et dépose-les dans les cases correctes aussi rapidement et précisément que possible.
          </p>
        </div>

        <div className="game-card">
          <div className="game-image osu-game">
            <img src="" alt="OSU" />
          </div>
          <h3 className="game-title">OSU</h3>
          <p className="game-description">
            Clique sur les cibles qui apparaissent à l'écran en rythme et avec précision, en suivant la cadence le plus rapidement possible.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MiniGameLobby;
