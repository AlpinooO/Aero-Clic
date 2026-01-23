import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';
import bodybuilderImage from '../images/AIbodybuilder.png';
import logoImage from '../images/aerologo.png';
import griprushImage from '../images/griprush.jpeg';
import clickstormImage from '../images/clickstorm.jpeg';
import beatpulseImage from '../images/beatpulse.jpeg';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      alert(`Prêt à s'entrainer, ${user.username} !`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logoImage} alt="AÉRO CLIC Logo" className="logo-image" />
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <span className="nav-link" onClick={handleAction}>S'entrainer</span>
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

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text-box">
            <h1 className="welcome-text">Bienvenue !</h1>
            <p className="hero-description">
              Transforme chaque clic en énergie et brûle des calories sans quitter ton écran !
            </p>
            <p className="hero-description">
              AÉRO CLIC est un gym virtuel ludique et motivant où tu progresses en cliquant
            </p>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={bodybuilderImage} alt="Bodybuilder" className="hero-bodybuilder-image" />
        </div>
      </section>

      <section className="features-footer">
        <div className="features-left">
          <h2 className="features-title">Pourquoi AÉRO CLIC ?</h2>
          
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">$</span>
              <span>Gratuit</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏃</span>
              <span>Accessible</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏋️</span>
              <span>Efficace</span>
            </div>
          </div>
          <p className="features-description">Adopter Aéro Click, c’est choisir une manière simple et motivante de rester actif au quotidien. Elle permet de faire de l’exercice sans contrainte de temps ni de lieu, ce qui facilite la régularité. Son aspect ludique renforce la motivation, réduit la fatigue mentale et rend l’effort plus agréable.</p>
        </div>

        <div className="cta-card">
          <div>
            <p className="cta-text">
              Que tu sois là pour t'amuser, te challenger ou simplement passer le temps, 
              chaque action te rapproche de tes objectifs. Plus tu cliques, plus tu gagnes 
              de points, d'endurance et de performance !
            </p>
            <button className="btn-clic" onClick={handleAction}>
              CLIC !
            </button>
          </div>
        </div>
      </section>

      <section className="game-description">
        <h2 className="features-title">Comment ça marche ?</h2>
        <p className="features-description">
          Choisis ton entrainement parmi plusieurs modes disponibles. Chaque exeercice sollicite ta rapidité, ta précision ou ta stratégie. Un timer rythme les sessions pour ajouter du challenge et mesurer tes performances. Plus tu interagies efficacement, plus tu brules de calories.
        </p>

        <div className="game-description-grid">
          <div className="game-description-item">
            <img src={griprushImage} alt="GripRush" className="game-description-image" />
            <h3 className="game-description-title">GripRush</h3>
            <p className="game-description-description">Déplace rapidement les éléments pour travailler ta précision et ta coordination.</p>
          </div>

          <div className="game-description-item">
            <img src={clickstormImage} alt="ClickStorm" className="game-description-image" />
            <h3 className="game-description-title">ClickStorm</h3>
            <p className="game-description-description">Clique le plus vite possible pour améliorer tes réflexes et brûler un maximum de calories.</p>
          </div>

          <div className="game-description-item">
            <img src={beatpulseImage} alt="BeatPulse" className="game-description-image" />
            <h3 className="game-description-title">BeatPulse</h3>
            <p className="game-description-description">Suis le rythme et touche les cibles pour tester ta concentration et ton endurance.</p>
          </div>
        </div>
      </section>
      <section className="footer">
        <div className="footer-grid">
          <div className="footer-grid-item">
            <h3>Besoin d'aide ?</h3>
            <p>
            FAQ<br/>
            Support client<br/>
            Contact<br/>
            CGV<br/>
            Politique de confidentialité<br/>
            Paramétrer les cookies<br/>
            Accessibilité non conforme<br/>
            </p>
          </div>
          <div className="footer-grid-item">
            <h3>Bien-être & Performance</h3>
            <p>
              Conseils entrainement & nutrition<br/>
              Programmes personnalisés<br/>
              Suivi des performances<br/>
              Challenges sportifs<br/>
              Communauté Aéro Clic<br/>
            </p>
          </div>
          <div className="footer-grid-item">
            <h3>A propos d'Aéro Clic</h3>
            <p>
              Presse<br/>
              Partenariats<br/>
              Offres Entreprises<br/>
              Recrutement<br/>
              Mentions légales<br/>
              Blog<br/>
              Réseaux sociaux<br/>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Aéro Clic. Tous droits réservés.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
