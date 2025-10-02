#!/bin/bash

# Syntax Sentry Deployment Script
# This script handles deployment to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "git is not installed. Please install git"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Run linting
    print_status "Running ESLint..."
    npm run lint
    
    # Run type checking
    print_status "Running TypeScript check..."
    npx tsc --noEmit
    
    # Run build test
    print_status "Testing build..."
    npm run build
    
    print_success "All tests passed"
}

# Function to deploy to staging
deploy_staging() {
    print_status "Deploying to staging..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    # Deploy to staging
    vercel --prod=false --confirm
    
    print_success "Staging deployment completed"
}

# Function to deploy to production
deploy_production() {
    print_status "Deploying to production..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    # Confirm production deployment
    read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Production deployment cancelled"
        exit 0
    fi
    
    # Deploy to production
    vercel --prod --confirm
    
    print_success "Production deployment completed"
}

# Function to show help
show_help() {
    echo "Syntax Sentry Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  staging     Deploy to staging environment"
    echo "  production  Deploy to production environment"
    echo "  test        Run tests without deployment"
    echo "  setup       Setup development environment"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 test"
    echo "  $0 staging"
    echo "  $0 production"
}

# Function to setup development environment
setup_dev() {
    print_status "Setting up development environment..."
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating from template..."
        if [ -f "env.example" ]; then
            cp env.example .env.local
            print_warning "Please update .env.local with your actual values"
        else
            print_error "env.example not found. Please create .env.local manually"
            exit 1
        fi
    fi
    
    # Install dependencies
    install_dependencies
    
    print_success "Development environment setup completed"
    print_status "Run 'npm run dev' to start the development server"
}

# Main script logic
main() {
    case "${1:-help}" in
        "staging")
            check_prerequisites
            install_dependencies
            run_tests
            deploy_staging
            ;;
        "production")
            check_prerequisites
            install_dependencies
            run_tests
            deploy_production
            ;;
        "test")
            check_prerequisites
            install_dependencies
            run_tests
            ;;
        "setup")
            check_prerequisites
            setup_dev
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
