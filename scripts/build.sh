#!/bin/bash

# Syntax Sentry Build Script
# Optimized build process for different environments

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

# Function to clean previous builds
clean_build() {
    print_status "Cleaning previous builds..."
    rm -rf .next/
    rm -rf out/
    rm -rf dist/
    print_success "Build directories cleaned"
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm ci --only=production
    print_success "Dependencies installed"
}

# Function to run linting
run_lint() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting passed"
}

# Function to run type checking
run_typecheck() {
    print_status "Running TypeScript check..."
    npx tsc --noEmit
    print_success "Type checking passed"
}

# Function to build application
build_app() {
    print_status "Building application..."
    
    # Set build environment
    export NODE_ENV=production
    
    # Run build
    npm run build
    
    print_success "Application built successfully"
}

# Function to optimize build
optimize_build() {
    print_status "Optimizing build..."
    
    # Analyze bundle size
    if command -v npx >/dev/null 2>&1; then
        print_status "Analyzing bundle size..."
        npx @next/bundle-analyzer .next/static/chunks/*.js || true
    fi
    
    print_success "Build optimization completed"
}

# Function to create deployment package
create_package() {
    print_status "Creating deployment package..."
    
    # Create package directory
    mkdir -p dist
    
    # Copy necessary files
    cp -r .next dist/
    cp -r public dist/
    cp package.json dist/
    cp package-lock.json dist/
    cp next.config.js dist/
    
    # Create start script
    cat > dist/start.sh << 'EOF'
#!/bin/bash
npm start
EOF
    chmod +x dist/start.sh
    
    print_success "Deployment package created in dist/"
}

# Function to show help
show_help() {
    echo "Syntax Sentry Build Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build       Build the application"
    echo "  clean       Clean build directories"
    echo "  package     Create deployment package"
    echo "  full        Full build with optimization and packaging"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 clean"
    echo "  $0 package"
    echo "  $0 full"
}

# Main script logic
main() {
    case "${1:-help}" in
        "build")
            clean_build
            install_deps
            run_lint
            run_typecheck
            build_app
            ;;
        "clean")
            clean_build
            ;;
        "package")
            build_app
            create_package
            ;;
        "full")
            clean_build
            install_deps
            run_lint
            run_typecheck
            build_app
            optimize_build
            create_package
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
