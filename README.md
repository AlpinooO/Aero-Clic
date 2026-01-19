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
- `API_URL`: Backend API URL (for future use)

## 📦 Adding New Services

The setup is designed to easily add more services. Here's how:

### 1. Adding a Backend Service

Uncomment the backend service in `docker-compose.yml`:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: aero-click-backend
  ports:
    - "${BACKEND_PORT:-5000}:5000"
  # ... rest of configuration
```

### 2. Adding a Database

Uncomment the database service in `docker-compose.yml`:

```yaml
database:
  image: postgres:15-alpine
  container_name: aero-click-db
  # ... rest of configuration
```

Don't forget to uncomment the volume definition at the bottom!

### 3. Creating Service Directories

```bash
mkdir backend
cd backend
# Add your backend code and Dockerfile
```

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

## 🎯 Next Steps

- [ ] Add backend service (Node.js, Python, etc.)
- [ ] Add database (PostgreSQL, MongoDB, etc.)
- [ ] Add authentication service
- [ ] Add API gateway/reverse proxy
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring (Prometheus, Grafana)
- [ ] Add logging service (ELK stack)

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

---

Built with ❤️ for aviation enthusiasts
