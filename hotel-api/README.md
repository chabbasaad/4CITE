# Hotel Booking System

A Laravel-based hotel booking system with user authentication, hotel management, and booking features.

## Prerequisites

- PHP >= 8.2
- Composer
- MySQL >= 8.0
- Node.js & NPM
- Docker & Docker Compose (for Docker installation)

## Installation

### Local Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
```

2. Install PHP dependencies
```bash
composer install
```

3. Create and configure environment file
```bash
cp .env.example .env
```

4. Configure your database in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotel
DB_USERNAME=root
DB_PASSWORD=
```

5. Generate application key
```bash
php artisan key:generate
```

6. Run migrations and seeders
```bash
php artisan migrate --seed
```

7. Start the development server
```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### Docker Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
```

2. Create environment file
```bash
cp .env.example .env
```

3. Configure your database in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret
```

4. Build and start the containers
```bash
docker-compose up -d --build
```

The application will be available at `http://localhost:8000`

### Docker Commands

- Start containers: `docker-compose up -d`
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs -f`
- Rebuild containers: `docker-compose up -d --build`
- Run artisan commands: `docker-compose exec app php artisan <command>`
- Run composer commands: `docker-compose exec app composer <command>`

## Features

- User Authentication
- Hotel Management
- Booking System
- Admin Dashboard
- API Endpoints

## Testing

### Local Testing
```bash
php artisan test
```

### Docker Testing
```bash
docker-compose exec app php artisan test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
