import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ClickGame.css';

function ClickGame() {
  const { user, logout } = useAuth();
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

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setLevel(1);
    setClicks(0);
    setTotalScore(0);
    setClicksRequired(5);
    setTimeLeft(levelTimeLimit);
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

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    if (!isPlaying) return;
    setClicks(prev => prev + 1);
  };

  const getProgress = () => {
    return Math.min((clicks / clicksRequired) * 100, 100);
  };

  return (
    <div className="game-container">
      <nav className="navbar">
        <div className="logo-container">
          <span>AÉRO</span>
          <span style={{ color: '#76ff03' }}>CLIC</span>
          <span style={{ fontSize: '1.5rem', marginLeft: '5px' }}>🖱️</span>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
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

      <div className="game-content">
        <div className="game-header">
          <h1 className="game-title">Mini-Jeu : Soulevé d'Haltère 💪</h1>
          <p className="game-subtitle">
            Clique rapidement pour soulever l'haltère avant la fin du temps !
          </p>
        </div>

        <div className="game-stats">
          <div className="stat-box">
            <span className="stat-label">Niveau</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Temps</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Score</span>
            <span className="stat-value">{totalScore}</span>
          </div>
        </div>

        <div className="game-area">
          {!isPlaying && !gameOver ? (
            <div className="start-screen">
              <h2>Prêt à t'entraîner ? 💪</h2>
              <p>Clique sur le bouton pour commencer</p>
              <button className="start-button" onClick={startGame}>
                Commencer
              </button>
              <div className="instructions">
                <h3>Comment jouer :</h3>
                <ul>
                  <li>Chaque niveau dure 3 secondes</li>
                  <li>Clique le nombre de fois requis avant la fin du temps</li>
                  <li>La difficulté augmente à chaque niveau (+3 clics)</li>
                  <li>Le jeu se termine si tu ne réussis pas à temps</li>
                  <li>Chaque clic rapporte 10 points</li>
                </ul>
              </div>
            </div>
          ) : gameOver ? (
            <div className="start-screen">
              <h2>Partie terminée ! 🏆</h2>
              <div className="final-stats">
                <div className="final-stat">
                  <span className="final-label">Niveau atteint</span>
                  <span className="final-value">{level}</span>
                </div>
                <div className="final-stat">
                  <span className="final-label">Score final</span>
                  <span className="final-value">{totalScore}</span>
                </div>
                <div className="final-stat">
                  <span className="final-label">Derniers clics</span>
                  <span className="final-value">{clicks}/{clicksRequired}</span>
                </div>
              </div>
              <button className="start-button" onClick={startGame}>
                Rejouer
              </button>
            </div>
          ) : (
            <div className="play-screen">
              <div className="level-info">
                <h2>Niveau {level}</h2>
                <p className="clicks-required">
                  Clics requis : <span className="highlight">{clicks}/{clicksRequired}</span>
                </p>
              </div>
              
              <div className="click-box-container">
                <div 
                  className="click-box" 
                  onClick={handleClick}
                >
                  <span className="click-text">CLIQUE</span>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label">Progression</div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${getProgress()}%` }}
                  >
                    <span className="progress-text">{Math.round(getProgress())}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="game-controls">
          <Link to="/minigame" className="back-button">
            ← Retour au lobby
          </Link>
          {isPlaying && (
            <button className="reset-button" onClick={endGame}>
              Arrêter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClickGame;
