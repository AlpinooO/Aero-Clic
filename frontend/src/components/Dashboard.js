import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import scoreService from '../services/score.service';
import styles from './Dashboard.module.css';
import './Navbar.css';
import logoImage from '../images/aerologo.png';
import avatarImage from '../images/avatar.png';

function Dashboard() {
  const { user, logout } = useAuth();
  const [personalBest, setPersonalBest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leaderboardData, personalData] = await Promise.all([
          scoreService.getLeaderboard(100),
          user ? scoreService.getPersonalBest().catch(() => null) : Promise.resolve(null),
        ]);
        setLeaderboard(leaderboardData);
        setPersonalBest(personalData);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // Mêmes données que la page Classement : entrée leaderboard (best_score, games_played)
  const leaderboardEntry = user
    ? leaderboard.find((entry) => entry.username === user.username)
    : null;
  const rank = leaderboardEntry
    ? leaderboard.findIndex((entry) => entry.username === user.username) + 1
    : null;
  const bestScore = leaderboardEntry?.best_score ?? personalBest?.bestScore ?? 0;
  const gamesPlayed = leaderboardEntry?.games_played ?? personalBest?.gamesPlayed ?? 0;

  return (
    <div className="dashboard-container">
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

      <section className={styles['dashboard-content']}>
        <div className={styles['profil-item']}>
          <img src={avatarImage} alt="Profil" className={styles['profil-image']} />
          <div className={styles['profil-infos']}>
            <div className={styles['profil-row']}>
              <span className={styles['profil-label']}>Nom</span>
              <span className={styles['profil-value']}>{user?.nom ?? user?.username ?? '-'}</span>
            </div>
            <div className={styles['profil-row']}>
              <span className={styles['profil-label']}>Mail</span>
              <span className={styles['profil-value']}>{user?.email ?? '-'}</span>
            </div>
          </div>
        </div>

        {user && (
          <div className={styles['stats-section']}>
            <h2 className={styles['stats-title']}>Statistiques</h2>
            {loading ? (
              <p className={styles['stats-loading']}>Chargement...</p>
            ) : (
              <div className={styles['stats-grid']}>
                <div className={styles['stat-card']}>
                  <span className={styles['stat-label']}>Score total</span>
                  <span className={styles['stat-value']}>
                    {(personalBest?.totalScore ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className={styles['stat-card']}>
                  <span className={styles['stat-label']}>Meilleur score</span>
                  <span className={styles['stat-value']}>
                    {Number(bestScore).toLocaleString()}
                  </span>
                </div>
                <div className={styles['stat-card']}>
                  <span className={styles['stat-label']}>Parties jouées</span>
                  <span className={styles['stat-value']}>{gamesPlayed}</span>
                </div>
                <div className={styles['stat-card']}>
                  <span className={styles['stat-label']}>Rang au classement</span>
                  <span className={styles['stat-value']}>
                    {rank > 0 ? `#${rank}` : '-'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
