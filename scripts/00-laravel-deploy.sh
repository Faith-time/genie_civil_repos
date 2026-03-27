#!/usr/bin/env bash
echo "▶ Installing composer dependencies..."
composer install --no-dev --working-dir=/var/www/html

echo "▶ Building React assets..."
npm ci && npm run build

echo "▶ Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "▶ Running migrations..."
php artisan migrate --force

echo "▶ Linking storage..."
php artisan storage:link
```

**`.dockerignore`**
```
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
npm-debug.log
