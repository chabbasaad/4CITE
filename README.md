# Hotel Booking System Full Stack Application (LARAVEL / REACT)

<div align="center">
  <img src="https://newsroom.ionis-group.com/wp-content/uploads/2020/11/supinfo-logo-2020-blanc-png.png" alt="SUPINFO Logo" width="200"/>

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

## 🚀 Installation Guide

### Backend Setup (Docker)

1. **Clone Repository**
   ```bash
   git clone https://github.com/chabbasaad/4CITE.git
   cd <project-folder>
   ```

2. **Configure Backend Environment**
   ```bash
   cd hotel-api
   ```

3. **Start Docker Services**
   ```bash
   docker-compose up -d --build
   ```


### get generated tokens for Testing in Forntend
   ```bash
      docker compose exec app cat /app/storage/test_tokens.env
   ```

   This command will:
   - Build and start all Docker containers
   - Automatically create the database
   - Run all migrations
   - Seed the database with initial data
   
   > Note: All database setup is handled automatically through a startup script. No manual migration commands are needed.

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

## 🌐 Access Points

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs/api`

## 🐳 Docker Management Commands (Backend Only)

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Run artisan commands
docker-compose exec app php artisan <command>
```

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
# Navigate to frontend directory
cd hotel-web

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🎨 Frontend Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Frontend Dependencies

- React v19.0.0
- TypeScript
- Tailwind CSS v4.0.9
- Headless UI
- Hero Icons
- Framer Motion
- Zustand (State Management)

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


