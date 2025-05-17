#!/bin/bash
# Helper script for Docker operations in the Color-Agent project

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display help
show_help() {
  echo -e "${GREEN}Color-Agent Docker Helper Script${NC}"
  echo ""
  echo "Usage: ./docker-helpers.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start           - Start all services with Docker Compose"
  echo "  stop            - Stop all services"
  echo "  restart         - Restart all services"
  echo "  logs [service]  - Show logs for a service (or all if not specified)"
  echo "  build [service] - Build a specific service (or all if not specified)"
  echo "  clean           - Remove all containers, volumes, and images"
  echo "  test            - Run tests in Docker environment"
  echo "  shell [service] - Open a shell in a running container"
  echo "  status          - Show status of all services"
  echo "  help            - Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./docker-helpers.sh start"
  echo "  ./docker-helpers.sh logs api"
  echo "  ./docker-helpers.sh shell web"
}

# Function to start services
start_services() {
  echo -e "${GREEN}Starting services...${NC}"
  docker compose up -d
  echo -e "${GREEN}Services started. Access:${NC}"
  echo "  - Web: http://localhost:3000"
  echo "  - API: http://localhost:8000"
}

# Function to stop services
stop_services() {
  echo -e "${YELLOW}Stopping services...${NC}"
  docker compose down
  echo -e "${GREEN}Services stopped.${NC}"
}

# Function to restart services
restart_services() {
  echo -e "${YELLOW}Restarting services...${NC}"
  docker compose down
  docker compose up -d
  echo -e "${GREEN}Services restarted.${NC}"
}

# Function to show logs
show_logs() {
  if [ -z "$1" ]; then
    echo -e "${GREEN}Showing logs for all services...${NC}"
    docker compose logs -f
  else
    echo -e "${GREEN}Showing logs for $1...${NC}"
    docker compose logs -f "$1"
  fi
}

# Function to build services
build_services() {
  if [ -z "$1" ]; then
    echo -e "${GREEN}Building all services...${NC}"
    docker compose build
  else
    echo -e "${GREEN}Building $1...${NC}"
    docker compose build "$1"
  fi
}

# Function to clean Docker resources
clean_docker() {
  echo -e "${YELLOW}Stopping all services...${NC}"
  docker compose down -v
  
  echo -e "${YELLOW}Removing all Color-Agent containers...${NC}"
  docker ps -a | grep coloragent | awk '{print $1}' | xargs -r docker rm -f
  
  echo -e "${YELLOW}Removing all Color-Agent images...${NC}"
  docker images | grep coloragent | awk '{print $3}' | xargs -r docker rmi -f
  
  echo -e "${GREEN}Docker environment cleaned.${NC}"
}

# Function to run tests
run_tests() {
  echo -e "${GREEN}Running tests in Docker environment...${NC}"
  docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
  docker compose -f docker-compose.test.yml down
}

# Function to open a shell in a container
open_shell() {
  if [ -z "$1" ]; then
    echo -e "${RED}Error: You must specify a service name.${NC}"
    echo "Usage: ./docker-helpers.sh shell [service]"
    echo "Example: ./docker-helpers.sh shell api"
    exit 1
  fi
  
  echo -e "${GREEN}Opening shell in $1 container...${NC}"
  docker compose exec "$1" /bin/sh
}

# Function to show status of services
show_status() {
  echo -e "${GREEN}Service status:${NC}"
  docker compose ps
}

# Main script logic
case "$1" in
  start)
    start_services
    ;;
  stop)
    stop_services
    ;;
  restart)
    restart_services
    ;;
  logs)
    show_logs "$2"
    ;;
  build)
    build_services "$2"
    ;;
  clean)
    clean_docker
    ;;
  test)
    run_tests
    ;;
  shell)
    open_shell "$2"
    ;;
  status)
    show_status
    ;;
  help|*)
    show_help
    ;;
esac
