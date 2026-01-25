import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import scoreService from '../services/score.service';
import styles from './Leaderboard.module.css';
import './Navbar.css';
import logoImage from '../images/aerologo.png';
import { Link } from 'react-router-dom';

function Leaderboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

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
  }, [limit]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles['leaderboard-page']}>
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
              onClick={handleLogout} 
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
