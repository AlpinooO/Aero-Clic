import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './MiniGameLobby.module.css';
import './Navbar.css';
import beatpulseImage from '../images/beatpulse.jpeg';
import griprushImage from '../images/griprush.jpeg';
import clickstormImage from '../images/clickstorm.jpeg';
import logoImage from '../images/aerologo.png';

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
    <div className={styles.homeContainer}>
      <nav className="navbar">
        <div className="logo-container">
          <img src={logoImage} alt="AÉRO CLIC Logo" className="logo-image" />
        </div>
        
<div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/minigame" className="nav-link">Mini-jeux</Link>
          <Link to="/leaderboard" className="nav-link">Classement</Link>
          {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
          
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

      <div className={styles.heroSection}>
      </div>

      <div className={styles.minigamesSection}>
        <Link to="/minigame/click" className={styles.gameCard}>
          <div className={`${styles.gameImage} ${styles.clickGame}`}>
            <img src={clickstormImage} alt="Clic" />
          </div>
          <h3 className={styles.gameTitle}>ClickStorm</h3>
          <p className={styles.gameDescription}>
            Clique le plus vite possible pour améliorer tes réflexes et brûler un maximum de calories.
          </p>
        </Link>

        <Link to="/minigame/griprush" className={styles.gameCard}>
          <div className={`${styles.gameImage} ${styles.dragDropGame}`}>
            <img src={griprushImage} alt="GripRush" />
          </div>
          <h3 className={styles.gameTitle}>GripRush</h3>
          <p className={styles.gameDescription}>
            Déplace rapidement les éléments pour travailler ta précision et ta coordination.
          </p>
        </Link>
          <Link to="/minigame/beatpulse" className={styles.gameCard}>
          <div className={`${styles.gameImage} ${styles.osuGame}`}>
            <img src={beatpulseImage} alt="BeatPulse" />
          </div>
          <h3 className={styles.gameTitle}>BeatPulse</h3>
          <p className={styles.gameDescription}>
            Suis le rythme et touche les cibles pour tester ta concentration et ton endurance.
          </p>
          </Link>
      </div>
    </div>
  );
}

export default MiniGameLobby;
