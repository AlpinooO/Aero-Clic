#!/bin/bash
# Bash Script to Switch Docker Environments

if [ $# -eq 0 ]; then
    echo "Usage: ./switch-env.sh [dev|staging|prod]"
    exit 1
fi

ENVIRONMENT=$1

if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo "Error: Environment must be 'dev', 'staging', or 'prod'"
    exit 1
fi

echo "Switching to $ENVIRONMENT environment..."

# Check if environment file exists
ENV_FILE=".env.$ENVIRONMENT"
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file $ENV_FILE not found!"
    exit 1
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Copy environment file
echo "Loading $ENVIRONMENT configuration..."
cp "$ENV_FILE" .env

# Start containers with new environment
echo "Starting containers in $ENVIRONMENT mode..."
docker-compose up -d

echo ""
echo "Environment switched to: $ENVIRONMENT"
echo "Run 'docker-compose logs -f' to view logs"
