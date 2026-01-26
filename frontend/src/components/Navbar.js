import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logoImage from '../images/aerologo.png';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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
  );
}

export default Navbar;
