import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import scoreService from '../services/score.service';
import Navbar from './Navbar';
import styles from './BeatGame.module.css';

function BeatGame() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [timeAllowed, setTimeAllowed] = useState(2000); 
  const [timeLeft, setTimeLeft] = useState(100); 
  const timerRef = useRef(null);
  const gameAreaRef = useRef(null);
  const targetSize = 60;
  const minTime = 400; 

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
    setTimeAllowed(2000);
    setTimeLeft(100);
    spawnNewTarget();
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const spawnNewTarget = () => {
    const area = gameAreaRef.current;
    if (!area) return;
    const { width, height } = area.getBoundingClientRect();
    setTargetPos(getRandomPosition(width, height, targetSize));
    setTimeLeft(100);
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / timeAllowed) * 100);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        endGame();
      }
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTargetClick = () => {
    if (!isPlaying) return;
    
    setScore(prev => prev + 1);
    
    setTimeAllowed(prev => Math.max(minTime, prev - 80));
    
    spawnNewTarget();
  };

  return (
    <div className={styles['game-container']}>
      <Navbar />

      <div className={styles['game-content']}>
        <div className={styles['game-header']}>
          <h1 className={styles['game-title']}>Mini-Jeu : BeatRush</h1>
          <p className={styles['game-subtitle']}>
            Clique sur les cibles avant que le temps s'écoule ! Le tempo accélère !
          </p>
        </div>

        <div className={styles['game-stats']}>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Tempo</span>
            <span className={styles['stat-value']}>{(timeAllowed / 1000).toFixed(1)}s</span>
          </div>
          <div className={styles['stat-box']}>
            <span className={styles['stat-label']}>Score</span>
            <span className={styles['stat-value']}>{score}</span>
          </div>
        </div>

        <div className={styles['game-area']}>
          {!isPlaying && !gameOver ? (
            <div className={styles['start-screen']}>
              <h2>Prêt à tester tes réflexes ?</h2>
              <p>Clique sur les cibles avant que le temps s'écoule</p>
              <button className={styles['start-button']} onClick={startGame}>
                Commencer
              </button>
              <div className={styles.instructions}>
                <h3>Comment jouer :</h3>
                <ul>
                  <li>Une cible apparaît aléatoirement sur l'écran</li>
                  <li>Clique dessus avant que le temps s'écoule</li>
                  <li>À chaque clic réussi, le tempo accélère !</li>
                  <li>Si tu rates, c'est game over</li>
                </ul>
              </div>
            </div>
          ) : gameOver ? (
            <div className={styles['start-screen']}>
              <h2>Partie terminée ! 🏆</h2>
              <div className={styles['final-stats']}>
                <div className={styles['final-stat']}>
                  <span className={styles['final-label']}>Score Final</span>
                  <span className={styles['final-value']}>{score}</span>
                </div>
                <div className={styles['final-stat']}>
                  <span className={styles['final-label']}>Tempo Final</span>
                  <span className={styles['final-value']}>{(timeAllowed / 1000).toFixed(1)}s</span>
                </div>
              </div>
              <button className={styles['start-button']} onClick={startGame}>
                Rejouer
              </button>
            </div>
          ) : (
            <div className={styles['play-screen']}>
              <div className={styles['level-info']}>
                <h2>Clique vite !</h2>
                <p className={styles['clicks-required']}>
                  Tempo : <span className={styles.highlight}>{(timeAllowed / 1000).toFixed(1)}s</span>
                </p>
              </div>

              <div className={styles['drag-area']} ref={gameAreaRef}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${timeLeft}%`,
                  height: '5px',
                  backgroundColor: timeLeft > 50 ? '#4CAF50' : timeLeft > 25 ? '#FFC107' : '#f44336',
                  transition: 'width 0.1s linear',
                  zIndex: 10
                }} />
                
                <div
                  className={styles['target-square']}
                  style={{ 
                    width: targetSize, 
                    height: targetSize, 
                    left: targetPos.x, 
                    top: targetPos.y,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={handleTargetClick}
                >
                  <span className={styles['target-text']}>CLIC</span>
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

export default BeatGame;
