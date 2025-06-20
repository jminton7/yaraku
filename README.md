# Yaraku Book Management System

A Laravel + React application for managing books with search, sort, and export functionality.

## Features

- Add, edit, delete books
- Search by title/author
- Sort by title, author, or ID
- Export to CSV/XML formats

## Requirements

- PHP, Laravel, Composer

```bash
- composer global require laravel/installer
- Powershell
# Run as administrator...
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
- Linux
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"

```

## Docker Quick Start

1. **Clone and start**:

```bash
git clone https://github.com/jminton7/yaraku.git
composer install
npm install
npm run build
php artisan key:generate
docker-compose up -d --build
php artisan migrate:fresh --seed
docker-compose up -d
```

2. **Access application**:

```
http://localhost:8080
```

## Developer Quick Start

1. **Clone and start**:

```bash
git clone https://github.com/jminton7/yaraku.git
composer install
npm install
npm run build
php artisan key:generate
composer run dev
```

2. **Seed if you need**:

```bash
php artisan migrate:fresh --seed
```

3. **Access application**:

```
http://127.0.0.1:8000
```

## Data Persistence

SQLite database persists at `./database/database.sqlite`

## API Endpoints

- `GET /books` - List books (supports search/sort)
- `POST /books` - Create book
- `PUT /books/{id}` - Update book
- `DELETE /books/{id}` - Delete book
- `GET /books/export` - Export books (CSV/XML)

## Deployments - Laravel Forge & DigitalOcean

In order to deploy to the live version http://134.209.23.169/

- Push into main and a CI/CD pipeline will take care of the rest

## Additional Info

I normally wouldn't put this in a ReadMe but for brevity after seeding you can login with.

- yaraku@dev.com
- password

I've also pushed up my .env in this special case.

Doing this
- docker-compose up -d --build
- php artisan migrate:fresh --seed
- docker-compose up -d

Is super weird but I couldn't get the database to create and migrate properly
