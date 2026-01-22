import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      alert(`Prêt à s'entrainer, ${user.username} !`);
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
            <h1 className="welcome-text">Bienvenue !</h1>
            <p className="hero-description">
              Transforme chaque clic en énergie et brûle des calories sans quitter ton écran !
            </p>
            <p className="hero-description">
              AÉRO CLIC est un gym virtuel ludique et motivant où tu progresses en cliquant
            </p>
          </div>
        </div>
        <div className="hero-image-container">
        </div>
      </div>

      <div className="features-footer">
        <div className="features-left">
          <h2 className="features-title">Pourquoi AÉRO CLIC :</h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">$</span>
              <span>Gratuit</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏃</span>
              <span>Accessible</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏋️</span>
              <span>Efficace</span>
            </div>
          </div>
        </div>

        <div className="cta-card">
          <p className="cta-text">
            Que tu sois là pour t'amuser, te challenger ou simplement passer le temps, 
            chaque action te rapproche de tes objectifs. Plus tu cliques, plus tu gagnes 
            de points, d'endurance et de performance !
          </p>
          <button className="btn-clic" onClick={handleAction}>
            CLIC !
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
