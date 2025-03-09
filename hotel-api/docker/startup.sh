#!/bin/bash

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
max_tries=30
counter=0

until mysql -h db -u hotel -proot hotel -e "SELECT 1" >/dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $max_tries ]; then
        echo "Failed to connect to MySQL after $max_tries attempts. Exiting..."
        exit 1
    fi
    echo "Attempting to connect to MySQL... ($counter/$max_tries)"
    sleep 5
done

echo "MySQL is ready!"

# Clear config and cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Run migrations
echo "Running migrations..."
php artisan migrate:fresh --force

# Run seeders
echo "Running seeders..."
php artisan db:seed --force

# Start PHP-FPM
echo "Starting PHP-FPM..."
php-fpm
