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

      <section className={styles.dashboardContent}>
        <div className={styles.profilCard}>
          <img src={avatarImage} alt="Profil" className={styles.profilImage} />
          <div className={styles.profilInfos}>
            <div className={styles.profilRow}>
              <span className={styles.profilLabel}>Nom</span>
              <span className={styles.profilValue}>{user?.nom ?? user?.username ?? '-'}</span>
            </div>
            <div className={styles.profilRow}>
              <span className={styles.profilLabel}>Mail</span>
              <span className={styles.profilValue}>{user?.email ?? '-'}</span>
            </div>
          </div>
        </div>

        {user && (
          <div className={styles.statsSection}>
            <h2 className={styles.statsTitle}>Statistiques</h2>
            {loading ? (
              <p className={styles.statsLoading}>Chargement...</p>
            ) : (
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statIcon} aria-hidden>⚡</span>
                  <span className={styles.statLabel}>Meilleur score ClickStorm</span>
                  <span className={styles.statValue}>{Number(bestScore).toLocaleString()}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon} aria-hidden>💪</span>
                  <span className={styles.statLabel}>Meilleur score GripRush</span>
                  <span className={styles.statValue}>{Number(bestScore).toLocaleString()}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon} aria-hidden>🎵</span>
                  <span className={styles.statLabel}>Meilleur score BeatPulse</span>
                  <span className={styles.statValue}>{Number(bestScore).toLocaleString()}</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon} aria-hidden>🎮</span>
                  <span className={styles.statLabel}>Parties jouées</span>
                  <span className={styles.statValue}>{gamesPlayed}</span>
                </div>
                <div className={`${styles.statCard} ${styles.statCardRank}`}>
                  <span className={styles.statIcon} aria-hidden>🏆</span>
                  <span className={styles.statLabel}>Rang au classement</span>
                  <span className={styles.statValue}>{rank > 0 ? `#${rank}` : '-'}</span>
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
