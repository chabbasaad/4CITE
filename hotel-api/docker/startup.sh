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

# Create storage directory if it doesn't exist
echo "Preparing storage directory..."
mkdir -p /app/storage
chown -R www-data:www-data /app/storage

# Generate test tokens and store them
echo "Generating test tokens..."
php artisan tokens:generate-test --env-format > /app/storage/test_tokens.env

# Make sure the tokens file is readable
chmod 644 /app/storage/test_tokens.env

# Start PHP-FPM
echo "Starting PHP-FPM..."
php-fpm
