#!/usr/bin/env bash
set -e
cd /var/www/html

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link || true
chown -R nginx:nginx storage bootstrap/cache
