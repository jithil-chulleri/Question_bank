#!/bin/bash

set -e

echo "=========================================="
echo "Question Bank Application Deployment"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Detect Docker Compose command (v1 or v2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose are installed"
echo ""

# Stop and remove existing containers
echo "Stopping existing containers..."
$DOCKER_COMPOSE down -v 2>/dev/null || true
echo "✓ Existing containers stopped"
echo ""

# Build all containers
echo "Building containers (this may take a few minutes)..."
$DOCKER_COMPOSE build --no-cache
echo "✓ Containers built successfully"
echo ""

# Start all services
echo "Starting services..."
$DOCKER_COMPOSE up -d
echo "✓ Services started"
echo ""

# Wait for services to be healthy
echo "Waiting for services to be ready..."
echo -n "Database: "
until $DOCKER_COMPOSE exec -T db pg_isready -U questionbank &> /dev/null; do
    echo -n "."
    sleep 2
done
echo " ✓"

echo -n "Backend: "
until curl -f http://localhost:8000/health &> /dev/null; do
    echo -n "."
    sleep 2
done
echo " ✓"

echo -n "Frontend: "
until curl -f http://localhost &> /dev/null; do
    echo -n "."
    sleep 2
done
echo " ✓"

echo ""
echo "=========================================="
echo "Application is ready!"
echo "=========================================="
echo ""
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@questionbank.com"
echo "  Password: admin123"
echo ""
echo "To view logs: $DOCKER_COMPOSE logs -f"
echo "To stop: $DOCKER_COMPOSE down"
echo "=========================================="
