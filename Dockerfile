FROM richarvey/nginx-php-fpm:3.1.6

RUN apk add --no-cache nodejs npm

COPY . .

# Tout ce qui est lourd → BUILD TIME
RUN composer install --no-dev --ignore-platform-reqs \
    && npm ci \
    && npm run build \
    && rm -rf node_modules

COPY conf/nginx/nginx-site.conf /etc/nginx/sites-enabled/default.conf

RUN chmod +x /var/www/html/scripts/00-laravel-deploy.sh

ENV SKIP_COMPOSER=1
ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1

CMD ["/start.sh"]
