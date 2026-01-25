import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './GripRushGame.module.css';
import './Navbar.css';
import logoImage from '../images/aerologo.png';

function GripRushGame() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [squarePos, setSquarePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef(null);
  const dragAreaRef = useRef(null);
  const squareSize = 50;
  const targetSize = 80;

  const getRandomPosition = (areaWidth, areaHeight, size) => {
    const maxX = Math.max(areaWidth - size, 0);
    const maxY = Math.max(areaHeight - size, 0);
    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(10);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const spawnNewRound = () => {
    const area = dragAreaRef.current;
    if (!area) return;
    const { width, height } = area.getBoundingClientRect();
    setSquarePos(getRandomPosition(width, height, squareSize));
    setTargetPos(getRandomPosition(width, height, targetSize));
  };

  useEffect(() => {
    if (!isPlaying) return;
    spawnNewRound();
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleDrop = (event) => {
    event.preventDefault();
    if (!isPlaying) return;
    setScore(prev => prev + 1);
    spawnNewRound();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleAction = () => {
    if (user) {
      alert(`Prêt à s'entrainer, ${user.username} !`);
    } else {
      navigate('/login');
    }
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
          <h1 className={styles['game-title']}>Mini-Jeu : GripRush</h1>
          <p className={styles['game-subtitle']}>
            Glisse le carré dans la cible le plus vite possible !
          </p>
        </div>

        <div className={styles['game-stats']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Temps</span>
            <span className={styles['stat-value']}>{timeLeft}s</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Carrés</span>
            <span className={styles['stat-value']}>{score}</span>
          </div>
        </div>

        <div className={styles['game-area']}>
          {!isPlaying && !gameOver ? (
            <div className={styles['start-screen']}>
              <h2>Prêt à t'entraîner ?</h2>
              <p>Glisse le carré dans la cible pendant 10 secondes</p>
              <button className={styles['start-button']} onClick={startGame}>
                Commencer
              </button>
              <div className={styles.instructions}>
                <h3>Comment jouer :</h3>
                <ul>
                  <li>Un carré et une cible apparaissent aléatoirement</li>
                  <li>Fais un drag & drop du carré dans la cible</li>
                  <li>Chaque réussite relance un nouveau tour</li>
                  <li>Tu as 10 secondes pour marquer un max</li>
                </ul>
              </div>
            </div>
          ) : gameOver ? (
            <div className={styles['start-screen']}>
              <h2>Partie terminée ! 🏆</h2>
              <div className={styles['final-stats']}>
                <div className={styles['final-stat']}>
                  <span className={styles['final-label']}>Carrés réussis</span>
                  <span className={styles['final-value']}>{score}</span>
                </div>
              </div>
              <button className={styles['start-button']} onClick={startGame}>
                Rejouer
              </button>
            </div>
          ) : (
            <div className={styles['play-screen']}>
              <div className={styles['level-info']}>
                <h2>Dépose le carré</h2>
                <p className={styles['clicks-required']}>
                  Score : <span className={styles.highlight}>{score}</span>
                </p>
              </div>

              <div className={styles['drag-area']} ref={dragAreaRef}>
                <div
                  className={styles['target-square']}
                  style={{ width: targetSize, height: targetSize, left: targetPos.x, top: targetPos.y }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <span className={styles['target-text']}>DROP</span>
                </div>
                <div
                  className={styles['draggable-square']}
                  style={{ width: squareSize, height: squareSize, left: squarePos.x, top: squarePos.y }}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', 'square')}
                >
                  <span className={styles['drag-text']}>DRAG</span>
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

export default GripRushGame;
