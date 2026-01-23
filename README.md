# Hotel Booking System Full Stack Application (LARAVEL / REACT)

<div align="center">
 
  ### Project Team 4CITE
  **Backend Developer:** Saad Chabba  
  **Frontend Developer:** Hamza Belyahiaoui
</div>

A comprehensive hotel booking system built with Laravel and React, featuring user authentication, hotel management, and advanced booking capabilities.

## 🛠 System Requirements

### Backend Requirements (Docker)
- Docker >= 20.10.x
- Docker Compose >= 2.0.x

### Frontend Requirements (Local)
- Node.js >= 18.x
- npm >= 9.x

## 📁 Project Structure
```
project-root/
├── hotel-api/          # Backend Laravel Application (Docker)
│   ├── Dockerfile
│   ├── docker/
│   │   └── nginx/     # Nginx configuration
│   └── ...
└── hotel-web/         # Frontend React Application (Local)
    └── ...
```

## 🚀 Installation Guide

### Backend Setup (Docker)

1. **Clone Repository**
   ```bash
   git clone https://github.com/chabbasaad/4CITE.git
   cd 4CITE
   ```

2. **Configure Backend**
   ```bash
   cd hotel-api
   ```

3. **Start Docker Services**
   ```bash
   docker-compose up -d --build
   ```

   > **Note:** Starting the services will take some time (5-8 minutes)
   
   This command handles the complete setup:
   - Builds and starts all Docker containers
   - Automatically creates the database
   - Runs all migrations through a startup script
   - Seeds the database with initial data

### Frontend Setup (Local)



1. **Navigate to Frontend Directory**
   ```bash
   cd hotel-web
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
3. **change env variable .ts **
   ```bash
   remplace  VITE_API_URL: "http://89.168.20.112:8000/api"

   by localhost
   
   VITE_API_URL: "http://localhost:8000/api"
   ```

## 🔑 Default Login Credentials

### Admin Account:
```
Email: admin@example.com
Password: password123
```

### Sample Employee Account:
```
Email: employee1@example.com
Password: password123
```

### Sample User Account:
```
Email: user1@example.com
Password: password123
```

### Seeded Data Includes:
- Sample Hotels with descriptions and images
- Room categories and pricing
- Example bookings
- User roles and permissions

## 🌐 Services & Access Points

### Backend Services (Docker)
- **Laravel API:** PHP-FPM service running Laravel application
- **Nginx:** Web server for the backend API
- **MySQL:** Database server

### Frontend Service (Local)
- **Vite Dev Server:** Local development server for React application

### Access Points
- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs/api`

## 🧪 Testing Guide

### Backend Testing (Docker)
```bash
# Run all tests
docker-compose exec app php artisan test

# Run specific test suites
docker-compose exec app php artisan test --testsuite=Unit
docker-compose exec app php artisan test --testsuite=Feature
```

### Frontend Testing (Local)
```bash
# Run tests
npm test

# Run Cypress tests in headless mode
npm run cypress:run

# Open Cypress Test Runner (GUI)
npm run cypress:open
```

## 🔧 Troubleshooting

### Backend Issues (Docker)
```bash
# Fix Permission Issues
docker-compose exec app chmod -R 777 storage bootstrap/cache

# Reset Environment
docker-compose down -v
docker-compose up -d --build
```

### Frontend Issues (Local)
```bash
# Node Modules Issues
rm -rf node_modules
npm install

# Port Conflicts
# Edit vite.config.ts to change port if 5173 is in use
```

## 📚 API Documentation with Scramble

Our project uses Scramble to automatically generate OpenAPI (Swagger) documentation for all API endpoints.

### Features
- Automatic OpenAPI 3.1.0 specification generation
- Interactive API documentation UI using Stoplight Elements
- Real-time documentation updates based on code changes
- Authentication endpoints documentation
- Request/Response schema documentation

### Accessing Documentation
```
http://localhost:8000/docs/api
```

## 🔄 GitHub Workflow & CI/CD Pipeline

### Pull Request Rules
- Mandatory Pull Requests for all new features
- At least one developer review required
- All conversations must be resolved
- CI pipeline must pass all tests

### CI/CD Pipeline Stages
1. **Pull Request Stage:**
   - Runs all unit and feature tests
   - Verifies code review requirements
   - Checks for resolved conversations

2. **Main Branch Stage:**
   - Comprehensive test suite execution
   - Security vulnerability scanning
   - Application build process
   - Deployment simulation

## ✨ Core Features
- User Authentication System
- Hotel Management Interface
- Advanced Booking System
- Administrative Dashboard
- RESTful API Endpoints

---

<div align="center">
  Made with Passion & ❤️ By 4CITE Team
</div>


