import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import scoreService from '../services/score.service';
import Navbar from './Navbar';
import styles from './Leaderboard.module.css';

function Leaderboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const leaderboardData = await scoreService.getLeaderboard(limit);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Auto-refresh every 5 seconds to catch new scores quickly
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [limit, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles['leaderboard-page']}>
<<<<<<< HEAD
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
=======
      <Navbar />
>>>>>>> 402ac7d69df11d96bdb9c0e7bf47e2d4319cea99

      <div className={styles['leaderboard-container']}>
        <h1 className={styles['title']}>🏆 Classement Général</h1>
        <p className={styles['subtitle']}>Les meilleurs joueurs de Aero Clic</p>

        <div className={styles['controls']}>
          <label>
            Nombre de joueurs:
            <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </label>
          <button 
            onClick={handleRefresh} 
            className={styles['refresh-button']}
            disabled={loading}
          >
            🔄 Actualiser
          </button>
        </div>

        {loading ? (
          <div className={styles['loading']}>
            <p>Chargement du classement...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          <div className={styles['leaderboard-table-container']}>
            <table className={styles['leaderboard-table']}>
              <thead>
                <tr>
                  <th className={styles['rank-col']}>Rang</th>
                  <th className={styles['player-col']}>Joueur</th>
                  <th className={styles['score-col']}>Meilleur Score</th>
                  <th className={styles['games-col']}>Parties Jouées</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = user && entry.username === user.username;
                  const rankClass = index < 3 ? styles[`rank-${index + 1}`] : '';
                  
                  return (
                    <tr 
                      key={index} 
                      className={`${isCurrentUser ? styles['current-user'] : ''} ${rankClass}`}
                    >
                      <td className={styles['rank-col']}>
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </td>
                      <td className={styles['player-col']}>
                        {entry.username}
                        {isCurrentUser && <span className={styles['you-badge']}>Vous</span>}
                      </td>
                      <td className={styles['score-col']}>{entry.best_score.toLocaleString()}</td>
                      <td className={styles['games-col']}>{entry.games_played}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles['no-data']}>
            <p>Aucun score enregistré pour le moment.</p>
            <p>Soyez le premier à jouer et à figurer dans le classement !</p>
            <Link to="/minigame" className={styles['play-button']}>Jouer maintenant</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
