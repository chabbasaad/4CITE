# Hotel Booking System Full Stack Application (LARAVEL / REACT)

<div align="center">
  <img src="https://newsroom.ionis-group.com/wp-content/uploads/2020/11/supinfo-logo-2020-blanc-png.png" alt="SUPINFO Logo" width="200"/>

  ### Project Team 4CITE
  **Backend Developer:** Saad Chabba  
  **Frontend Developer:** Hamza Belyahiaoui
</div>

A comprehensive hotel booking system built with Laravel and React, featuring user authentication, hotel management, and advanced booking capabilities.

## 🛠 System Requirements

- PHP >= 8.2
- Composer (Latest Version)
- MySQL >= 8.0
- Node.js & NPM
- Docker & Docker Compose (Optional, for containerized setup)

## 🚀 Installation Methods

### Method A: Local Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/chabbasaad/4CITE.git
   cd <project-folder>
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Database Configuration**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hotel
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Application Setup**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

### Method B: Docker Installation (Recommended)

1. **Clone Repository**
   ```bash
   git clone https://github.com/chabbasaad/4CITE.git
   cd <project-folder>
   ```

2. **Launch Docker Environment**
   ```bash
   docker-compose up -d --build
   ```

## 🌐 Access Points

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs/api`

## 🐳 Docker Management Commands

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

# Run composer commands
docker-compose exec app composer <command>
```

## 🧪 Testing Guide

### Backend Testing

#### Local Testing Commands
```bash
# Run all tests
php artisan test

# Run unit tests only
php artisan test --testsuite=Unit

# Run feature tests only
php artisan test --testsuite=Feature

# Run specific test class
php artisan test --filter=AuthenticationTest
```

#### Docker Testing Commands
```bash
# Run all tests
docker-compose exec app php artisan test

# Run unit tests only
docker-compose exec app php artisan test --testsuite=Unit

# Run feature tests only
docker-compose exec app php artisan test --testsuite=Feature
```

## 🎨 Frontend Setup and Testing

### Docker Installation (Frontend)

1. **Navigate to Frontend Directory**
   ```bash
   cd front-end
   ```

2. **Build Docker Image**
   ```bash
   docker build -t hotel-frontend .
   ```

3. **Run Frontend Container**
   ```bash
   docker run -d -p 5173:3000 --name hotel-frontend hotel-frontend
   ```

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Frontend Testing

```bash
# Run tests in Docker container
docker exec hotel-frontend npm test

# Run tests with coverage
docker exec hotel-frontend npm test -- --coverage

# Run tests in watch mode
docker exec hotel-frontend npm test -- --watch
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


