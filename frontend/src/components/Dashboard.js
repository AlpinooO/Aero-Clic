import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import scoreService from '../services/score.service';
import Navbar from './Navbar';
import styles from './Dashboard.module.css';
import avatarImage from '../images/avatar.png';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Calories');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Année');
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalBest, setPersonalBest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le leaderboard
        const leaderboardData = await scoreService.getLeaderboard(10);
        setLeaderboard(leaderboardData);

        // Récupérer les meilleurs scores personnels si connecté
        if (user) {
          const personalData = await scoreService.getPersonalBest();
          setPersonalBest(personalData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAction = () => {
    if (user) {
      alert(`Prêt à s'entrainer, ${user.username} !`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <section className={styles['dashboard-content']}>
        <div className={styles['profil-item']}>
            <img src={avatarImage} alt="Profil" className={styles['profil-image']} />
            <button className={styles['profil-button']}>Modifier le profil</button>
        </div>
        <div className={styles['counters']}>
            <div className={styles['counter-item']}>
                <h3>Meilleur score</h3>
                <p>{personalBest?.bestScore || 0}</p>
            </div>
            <div className={styles['counter-item']}>
                <h3>Parties jouées</h3>
                <p>{personalBest?.gamesPlayed || 0}</p>
            </div>
            <div className={styles['counter-item']}>
                <h3>Rang dans le classement</h3>
                <p>{leaderboard.findIndex(entry => entry.username === user?.username) + 1 || '-'}</p>
            </div>
            <div className={styles['counter-item']}>
                <h3>Score moyen</h3>
                <p>{personalBest?.gamesPlayed > 0 ? Math.round((personalBest?.bestScore || 0) / personalBest.gamesPlayed) : 0}</p>
            </div>
        </div>

        <div className={styles['graph']}>
          <div className={styles['graph-controls']}>
            <div className={styles['category-buttons']}>
              <button 
                className={`${styles['control-button']} ${selectedCategory === 'Calories' ? styles['active'] : ''}`}
                onClick={() => setSelectedCategory('Calories')}
              >
                Calories
              </button>
              <button 
                className={`${styles['control-button']} ${selectedCategory === 'Actions' ? styles['active'] : ''}`}
                onClick={() => setSelectedCategory('Actions')}
              >
                Actions
              </button>
            </div>
            <div className={styles['timeframe-buttons']}>
              <button 
                className={`${styles['control-button']} ${selectedTimeframe === 'Jour' ? styles['active'] : ''}`}
                onClick={() => setSelectedTimeframe('Jour')}
              >
                Jour
              </button>
              <button 
                className={`${styles['control-button']} ${selectedTimeframe === 'Semaine' ? styles['active'] : ''}`}
                onClick={() => setSelectedTimeframe('Semaine')}
              >
                Semaine
              </button>
              <button 
                className={`${styles['control-button']} ${selectedTimeframe === 'Mois' ? styles['active'] : ''}`}
                onClick={() => setSelectedTimeframe('Mois')}
              >
                Mois
              </button>
              <button 
                className={`${styles['control-button']} ${selectedTimeframe === 'Année' ? styles['active'] : ''}`}
                onClick={() => setSelectedTimeframe('Année')}
              >
                Année
              </button>
            </div>
          </div>
          <div className={styles['chart-container']}>
            <div className={styles['y-axis']}>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>
            <div className={styles['chart-area']}>
              <div className={styles['chart-bars']}>
                <div className={styles['bar-wrapper']}>
                  <div className={styles['bar']} style={{ height: '50%' }}></div>
                  <span className={styles['x-axis-label']}>2021</span>
                </div>
                <div className={styles['bar-wrapper']}>
                  <div className={styles['bar']} style={{ height: '77%' }}></div>
                  <span className={styles['x-axis-label']}>2022</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;