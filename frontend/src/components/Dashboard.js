import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import './Navbar.css';
import logoImage from '../images/aerologo.png';
import { Link } from 'react-router-dom';
import avatarImage from '../images/avatar.png';
function Dashboard() {
    const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Calories');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Année');

  const handleAction = () => {
    if (user) {
      alert(`Prêt à s'entrainer, ${user.username} !`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logoImage} alt="AÉRO CLIC Logo" className="logo-image" />
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <span className="nav-link" onClick={handleAction}>S'entrainer</span>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          
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
            <button className={styles['profil-button']}>Modifier le profil</button>
        </div>
        <div className={styles['counters']}>
            <div className={styles['counter-item']}>
                <h3>Calories brulées</h3>
                <p>315 cal</p>
            </div>
            <div className={styles['counter-item']}>
                <h3>Nombre total d'actions</h3>
                <p>111 000</p>
            </div>
            <div className={styles['counter-item']}>
                <h3>Niveau actuel</h3>
                <p>beignet</p>
            </div>
            <div className={styles['counter-item']}>
                <h3>Niveau suivant</h3>
                <div className={styles['progress-bar-container']}>
                    <div className={styles['progress-bar']} style={{ width: '60%' }}></div>
                </div>
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