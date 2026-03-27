#!/usr/bin/env bash
set -e

echo "▶ Installing composer dependencies..."
composer install --no-dev --ignore-platform-reqs --working-dir=/var/www/html

echo "▶ Building React assets..."
cd /var/www/html && npm ci && npm run build

echo "▶ Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "▶ Running migrations..."
php artisan migrate --force

echo "▶ Linking storage..."
php artisan storage:link
