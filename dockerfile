FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    sqlite3 \
    libsqlite3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy only composer files and the artisan script needed for Composer scripts
COPY composer.json composer.lock ./
COPY artisan ./
COPY bootstrap/app.php bootstrap/app.php

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-scripts

# After composer install, copy the rest of the application.
COPY . /var/www

# Install Node dependencies
RUN npm install

# Build assets
RUN npm run build

# Ensure proper permissions for www-data
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www

EXPOSE 9000

CMD ["php-fpm"]