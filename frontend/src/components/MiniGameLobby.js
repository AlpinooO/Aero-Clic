import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import styles from './MiniGameLobby.module.css';
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar />

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
