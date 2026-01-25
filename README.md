# Aero Click 🛩️

A modular web service platform built with Docker, designed for easy scalability and service integration.

## 🏗️ Current Architecture

- **Frontend**: React 18 application with hot-reload development
- **Docker**: Multi-stage builds for development and production
- **Networking**: Isolated Docker network for service communication

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose V2
- Git

## 🚀 Quick Start

### Development Mode

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Aero-Clic
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Production Mode

Build and run the production version:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

Access at http://localhost:80

## 📁 Project Structure

```
Aero-Clic/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── App.js           # Main App component
│   │   ├── App.css          # App styles
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles
│   ├── Dockerfile           # Multi-stage Docker build
│   ├── nginx.conf           # Nginx config for production
│   └── package.json         # Dependencies
├── docker-compose.yml       # Development services
├── docker-compose.prod.yml  # Production services
├── .env                     # Environment variables (git-ignored)
├── .env.example             # Environment template
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Key variables:
- `FRONTEND_PORT`: Port for frontend (default: 3000)
- `API_GATEWAY_PORT`: Port for API Gateway (default: 5000)
- `BUSINESS_API_PORT`: Port for Business API (default: 5001)
- `DB_NAME`: Database name (default: aeroclic)
- `DB_PASSWORD`: MySQL root password
- `JWT_SECRET`: Secret key for JWT tokens
- `REDIS_PORT`: Redis cache port (default: 6379)

## 🗄️ Base de données

L'application utilise MySQL 8.0 avec les tables suivantes :

- **users** : Stockage sécurisé des utilisateurs (id, username, password hashé)
- **scores** : Enregistrement des performances (user_id, game_id, score)
- **games** : Liste des mini-jeux disponibles

Le fichier `init.sql` crée automatiquement ces tables au premier démarrage.

## 🛠️ Common Commands

### Development

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

### Production

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up --build -d

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Useful Docker Commands

```bash
# List running containers
docker ps

# Execute command in container
docker exec -it aero-click-frontend sh

# View container logs
docker logs aero-click-frontend

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune
```

## 🔍 Debugging

### Frontend not loading?

1. Check if container is running: `docker ps`
2. Check logs: `docker-compose logs frontend`
3. Ensure port 3000 is not in use

### Container won't start?

1. Check Docker daemon is running
2. Rebuild images: `docker-compose up --build`
3. Check for port conflicts in `.env`

### Database connection issues?

1. Wait for database health check: `docker-compose logs database`
2. Verify credentials in `.env` file
3. Check if init.sql executed: `docker exec -it aero-click-database mysql -uroot -p -e "USE aeroclic; SHOW TABLES;"`

## 🎮 API Endpoints

### Authentication (API Gateway - Port 5000)
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter
- `GET /api/auth/me` - Obtenir le profil

### Scores (Business API - Port 5001)
- `GET /scores` - Récupérer les scores
- Passwords are hashed with bcrypt for security
- Redis cache improves leaderboard performance
- MySQL health checks ensure database is ready before API starts
- `GET /scores/leaderboard` - Classement général
- `GET /scores/personal-best` - Records personnels
- `POST /scores` - Enregistrer un score

### Game Sessions (Business API - Port 5001)
- `POST /game/start` - Démarrer une session
- `POST /game/update` - Mettre à jour la progression
- `GET /game/session` - Session active
- `POST /game/end` - Terminer la session

## 📝 Notes

- Development mode includes hot-reload for React
- Production build uses Nginx for optimized static file serving
- All services communicate through `aero-click-network`
- Volumes preserve data between container restarts

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test with Docker
4. Submit a pull request

## 📄 License

[Your License Here]
Développé pour les passionnés de fitness virtuel 💪
---

Built with ❤️ for aviation enthusiasts
