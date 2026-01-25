# Aero Clic 🏋️

Application web de salle de gym virtuelle avec mini-jeux interactifs, développée avec une architecture Docker multi-tiers. 
Les utilisateurs peuvent s'entraîner virtuellement à travers différents exercices gamifiés, suivre leurs performances et défier les autres joueurs.

## 🏗️ Architecture Multi-tiers

L'application utilise une architecture en 5 tiers pour une scalabilité optimale :

- **Tier 1 - Frontend**: React 18 avec React Router pour la navigation
- **Tier 2 - API Gateway**: Express.js avec authentification JWT et gestion de sessions
- **Tier 3 - Business API**: Express.js pour la logique métier et gestion des scores
- **Tier 4 - Base de données**: MySQL 8.0 pour la persistance des données
- **Tier 5 - Cache**: Redis 7 pour optimiser les performances des classements

## 🛠️ Stack Technique

### Frontend
- **React 18** - Framework UI avec hooks
- **React Router v6** - Navigation entre pages
- **CSS Modules** - Styles scopés par composant
- **Fetch API** - Communication avec le backend

### Backend
- **Node.js 18** - Runtime JavaScript
- **Express.js 4.18** - Framework serveur web
- **MySQL2** - Client MySQL avec support des Promises
- **Redis** - Cache en mémoire pour les classements
- **bcrypt** - Hachage sécurisé des mots de passe
- **jsonwebtoken** - Authentification JWT
- **express-session** - Gestion des sessions

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-conteneurs
- **Nginx** - Serveur web pour la production
- **Alpine Linux** - Images Docker légères

## 📋 Prérequis

- Docker Desktop (Windows/Mac) ou Docker Engine (Linux)
- Docker Compose V2
- Git

## 🚀 Démarrage rapide

### Méthode 1 : Script automatique (Windows)

```powershell
.\start.ps1
```

### Méthode 2 : Commandes manuelles

1. **Cloner le repository**
   ```bash
   git clone https://github.com/AlpinooO/Aero-Clic.git
   cd Aero-Clic
   ```

2. **Démarrer l'application**
   ```bash
   docker-compose up -d --build
   ```

3. **Accéder à l'application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:5000
   - Business API: http://localhost:5001
   - MySQL: localhost:3306
   - Redis: localhost:6379

## 📁 Structure du projet

```
Aero-Clic/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/          # Composants React
│   │   │   ├── Home.js         # Page d'accueil
│   │   │   ├── Login.js        # Authentification
│   │   │   ├── Register.js     # Inscription
│   │   │   ├── Dashboard.js    # Tableau de bord utilisateur
│   │   │   ├── Leaderboard.js  # Classement global
│   │   │   ├── ClickGame.js    # Mini-jeu de clics
│   │   │   └── MiniGameLobby.js # Sélection de jeux
│   │   ├── context/
│   │   │   └── AuthContext.js  # Contexte d'authentification
│   │   ├── services/
│   │   │   ├── auth.service.js # Service API auth
│   │   │   └── score.service.js # Service API scores
│   │   └── App.js              # Composant principal
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── api-gateway/                 # API d'authentification
│   ├── routes/
│   │   ├── auth.routes.js      # Routes d'authentification
│   │   └── proxy.routes.js     # Proxy vers Business API
│   ├── middleware/
│   │   └── auth.middleware.js  # Middleware JWT
│   ├── config/
│   │   └── db.config.js        # Configuration MySQL
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── business-api/                # API métier
│   ├── routes/
│   │   ├── scores.routes.js    # Gestion des scores
│   │   └── game.routes.js      # Sessions de jeu
│   ├── config/
│   │   ├── db.config.js        # Configuration MySQL
│   │   └── redis.config.js     # Configuration Redis
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── init.sql                     # Script d'initialisation DB
├── docker-compose.yml           # Configuration développement
├── docker-compose.prod.yml      # Configuration production
├── start.ps1                    # Script de démarrage Windows
└── README.md

```

## 🗄️ Base de données

### Schéma MySQL

```sql
-- Table des utilisateurs
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),  -- Haché avec bcrypt
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Table des scores
scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  game_id INT,
  score INT,
  played_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)

-- Table des jeux
games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE,
  description TEXT,
  created_at TIMESTAMP
)
```

### Données de test

3 utilisateurs de test sont créés automatiquement avec des mots de passe hashés avec bcrypt (voir le script `init.sql`) :
- **admin**
- **athlete1**
- **champion**

## 🎮 Fonctionnalités

### Authentification
- ✅ Inscription avec validation
- ✅ Connexion sécurisée (JWT + sessions)
- ✅ Déconnexion
- ✅ Routes protégées

### Mini-jeux
- ✅ Click Game - Jeu de clics rapides avec niveaux
- ✅ Sauvegarde automatique des scores
- ✅ Progression par niveaux

### Tableau de bord
- ✅ Statistiques personnelles (meilleur score, parties jouées)
- ✅ Rang dans le classement
- ✅ Score moyen

### Classement
- ✅ Top 10/25/50/100 joueurs
- ✅ Podium avec médailles 🥇🥈🥉
- ✅ Mise en évidence du joueur actuel
- ✅ Accessible sans connexion

## 🛠️ Commandes utiles

### Démarrage et arrêt

```bash
# Démarrer tous les services
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (réinitialise la DB)
docker-compose down -v
```

### Débogage

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Voir les logs d'un service spécifique
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f business-api

# Accéder à la base de données
docker exec -it aero-click-database mysql -u root -prootpassword

# Voir les scores enregistrés
docker exec -it aero-click-database mysql -u root -prootpassword -e "USE aeroclic; SELECT * FROM scores;"

# Vérifier le cache Redis
docker exec -it aero-click-redis redis-cli KEYS "*"
```

## 🎯 API Endpoints

### Authentication (Port 5000)
```
POST   /api/auth/register      - Créer un compte
POST   /api/auth/login         - Se connecter
POST   /api/auth/logout        - Se déconnecter
GET    /api/auth/me            - Profil utilisateur
```

### Scores (Port 5000 - Proxy vers 5001)
```
POST   /api/scores             - Enregistrer un score (authentifié)
GET    /api/scores/leaderboard - Classement général (public)
GET    /api/scores/personal-best - Records personnels (authentifié)
```

### Game Sessions (Port 5000 - Proxy vers 5001)
```
POST   /api/game/start         - Démarrer une session (authentifié)
POST   /api/game/end           - Terminer une session (authentifié)
```

## 🔐 Sécurité

- Mots de passe hachés avec **bcrypt** (10 rounds)
- Authentification par **JWT** avec expiration
- Sessions sécurisées avec **express-session**
- Routes protégées par middleware d'authentification
- Validation des entrées utilisateur
- Headers CORS configurés

## 🚀 Production

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Accès sur http://localhost:80

## 🤝 Contribution

1. Créer une branche feature
2. Faire les modifications
3. Tester avec Docker
4. Créer une pull request

## 📄 Licence

Projet personnel - École

---

**Développé avec ❤️ pour le cours de Docker**
