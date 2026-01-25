import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import scoreService from '../services/score.service';
import './ClickGame.css';
import styles from './ClickGame.module.css';
import './Navbar.css';
import logoImage from '../images/aerologo.png';

function ClickGame() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [clicksRequired, setClicksRequired] = useState(5);
  const timerRef = useRef(null);
  const clicksRef = useRef(0);
  const clicksRequiredRef = useRef(5);
  const levelTimeLimit = 3;

  useEffect(() => {
    clicksRef.current = clicks;
    clicksRequiredRef.current = clicksRequired;
  }, [clicks, clicksRequired]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      if (clicksRef.current >= clicksRequiredRef.current) {
        nextLevel();
      } else {
        endGame();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const startGame = async () => {
    setIsPlaying(true);
    setGameOver(false);
    setLevel(1);
    setClicks(0);
    setTotalScore(0);
    setClicksRequired(5);
    setTimeLeft(levelTimeLimit);

    // Démarrer une session de jeu
    if (user) {
      try {
        await scoreService.startGameSession();
      } catch (error) {
        console.error('Failed to start game session:', error);
      }
    }
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    const newRequired = clicksRequired + 3;
    setLevel(newLevel);
    setTotalScore(totalScore + clicks * 10);
    setClicks(0);
    setClicksRequired(newRequired);
    setTimeLeft(levelTimeLimit);
  };

  const endGame = async () => {
    setIsPlaying(false);
    setGameOver(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Enregistrer le score final dans la BDD
    if (user && totalScore > 0) {
      try {
        await scoreService.submitScore(1, totalScore);
        await scoreService.endGameSession();
        console.log('Score enregistré avec succès!');
      } catch (error) {
        console.error('Failed to save score:', error);
      }
    }
  };

  const handleClick = () => {
    if (!isPlaying) return;
    setClicks(prev => prev + 1);
  };

  const handleAction = () => {
    if (user) {
      alert(`Prêt à s'entrainer, ${user.username} !`);
    } else {
      navigate('/login');
    }
  };

  const getProgress = () => {
    return Math.min((clicks / clicksRequired) * 100, 100);
  };

  return (
    <div className={styles['game-container']}>
      <nav className="navbar">
        <div className="logo-container">
          <img src={logoImage} alt="AÉRO CLIC Logo" className="logo-image" />
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <span className="nav-link" onClick={handleAction}>S'entrainer</span>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
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

      <div className={styles['game-content']}>
        <div className={styles['game-header']}>
          <h1 className={styles['game-title']}>Mini-Jeu : Clic haltère</h1>
          <p className={styles['game-subtitle']}>
            Clique rapidement pour soulever l'haltère avant la fin du temps !
          </p>
        </div>

        <div className={styles['game-stats']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Niveau</span>
            <span className={styles['stat-value']}>{level}</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Temps</span>
            <span className={styles['stat-value']}>{timeLeft}s</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Score</span>
            <span className={styles['stat-value']}>{totalScore}</span>
          </div>
        </div>

        <div className={styles['game-area']}>
          {!isPlaying && !gameOver ? (
            <div className={styles['start-screen']}>
              <h2>Prêt à t'entraîner ?</h2>
              <p>Clique sur le bouton pour commencer</p>
              <button className={styles['start-button']} onClick={startGame}>
                Commencer
              </button>
              <div className={styles.instructions}>
                <h3>Comment jouer :</h3>
                <ul>
                  <li>Clique le nombre de fois requis avant la fin du temps</li>
                  <li>La difficulté augmente à chaque niveau</li>
                  <li>Le jeu se termine si tu ne réussis pas à temps</li>
                  <li>Chaque clic rapporte 10 points</li>
                </ul>
              </div>
            </div>
          ) : gameOver ? (
            <div className={styles['start-screen']}>
              <h2>Partie terminée ! 🏆</h2>
              <div className={styles['final-stats']}>
                <div className={styles['final-stat']}>
                  <span className={styles['final-label']}>Niveau atteint</span>
                  <span className={styles['final-value']}>{level}</span>
                </div>
                <div className={styles['final-stat']}>
                  <span className={styles['final-label']}>Score final</span>
                  <span className={styles['final-value']}>{totalScore}</span>
                </div>
                <div className={styles['final-stat']}>
                  <span className={styles['final-label']}>Derniers clics</span>
                  <span className={styles['final-value']}>{clicks}/{clicksRequired}</span>
                </div>
              </div>
              <button className={styles['start-button']} onClick={startGame}>
                Rejouer
              </button>
            </div>
          ) : (
            <div className={styles['play-screen']}>
              <div className={styles['level-info']}>
                <h2>Niveau {level}</h2>
                <p className={styles['clicks-required']}>
                  Clics requis : <span className={styles.highlight}>{clicks}/{clicksRequired}</span>
                </p>
              </div>
              
              <div className={styles['click-box-container']}>
                <div 
                  className={styles['click-box']} 
                  onClick={handleClick}
                >
                  <span className={styles['click-text']}>CLIQUE</span>
                </div>
              </div>

              <div className={styles['progress-container']}>
                <div className={styles['progress-label']}>Progression</div>
                <div className={styles['progress-bar-bg']}>
                  <div 
                    className={styles['progress-bar-fill']} 
                    style={{ width: `${getProgress()}%` }}
                  >
                    <span className={styles['progress-text']}>{Math.round(getProgress())}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles['game-controls']}>
          <Link to="/minigame" className={styles['back-button']}>
            ← Retour au lobby
          </Link>
          {isPlaying && (
            <button className={styles['reset-button']} onClick={endGame}>
              Arrêter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClickGame;
