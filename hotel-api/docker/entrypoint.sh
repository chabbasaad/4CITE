#!/bin/bash

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
while ! php artisan db:monitor 2>/dev/null; do
    sleep 1
done

# Install dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader

# Generate key if not set
php artisan key:generate --no-interaction --force

# Clear cache
php artisan cache:clear
php artisan config:clear

# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --force

# Start PHP-FPM in the foreground
exec php-fpm --nodaemonize
