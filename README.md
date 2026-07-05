# Mini-ERP System

A production-grade, secure, multi-tenant Mini-ERP application built using the MERN/MERN-adjacent stack (NestJS, React, MongoDB, TypeScript, Tailwind CSS). Features robust Role-Based Access Control (RBAC), real-time inventory management, sales invoicing, customer relationship management, and analytic dashboards.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Environment Configuration](#environment-configuration)
5. [Local Development Setup](#local-development-setup)
6. [Database Seeding](#database-seeding)
7. [Production Deployment (Docker Compose)](#production-deployment-docker-compose)
8. [Manual Production Deployment (Nginx & PM2)](#manual-production-deployment-nginx--pm2)
9. [Production Security & Checklist](#production-security--checklist)

---

## Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB via Mongoose ODM
- **Authentication**: Passport JWT (Access Tokens & HTTP-Only Cookie Refresh Tokens)
- **Validation**: NestJS Class-Validator / Class-Transformer
- **API Documentation**: Swagger / OpenAPI

### Frontend
- **Framework**: React 18 (Vite, TypeScript)
- **Styling**: Tailwind CSS (with custom utility tokens)
- **State Management**: Zustand
- **Server Cache & Sync**: TanStack Query (React Query v5)
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: Sonner

---

## Project Structure

```text
mini-erp/
├── backend/                  # NestJS API application
│   ├── src/
│   │   ├── common/           # Guards, Interceptors, Decorators, Filters
│   │   ├── database/         # Connection setups and custom Mongoose plugins
│   │   ├── modules/          # Users, Roles, Permissions, Products, Sales, Customers
│   │   └── main.ts           # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # React SPA application
│   ├── src/
│   │   ├── app/              # Router and provider setups
│   │   ├── components/       # Layouts and reusable UI elements
│   │   ├── features/         # Feature-specific state, forms, hooks, and services
│   │   ├── pages/            # View pages
│   │   └── main.tsx          # Application entry point
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml        # Production Orchestration
```

---

## Prerequisites

- **Node.js**: v18.x or v20.x (LTS recommended)
- **npm**: v9.x or higher
- **MongoDB**: v6.0 or higher
- **Docker & Docker Compose**: (Required for containerized deployment)

---

## Environment Configuration

Create the following files in their respective folders:

### Backend Environment (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-erp

# JWT Secrets (Generate secure random strings in production)
JWT_ACCESS_SECRET=your_super_secret_access_key_12345!
JWT_REFRESH_SECRET=your_super_secret_refresh_key_67890!
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# File Upload Configuration
MAX_FILE_SIZE=2097152
UPLOAD_PATH=./uploads
```

### Frontend Environment (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Local Development Setup

### 1. Start MongoDB
Ensure MongoDB is running locally. If using Docker:
```bash
docker run -d -p 27017:27017 --name erp-mongo mongo:6.0
```

### 2. Backend Installation & Start
```bash
cd backend
npm install
npm run start:dev
```
The API server starts at `http://localhost:5000/api/v1`. Access Swagger docs at `http://localhost:5000/api/docs`.

### 3. Frontend Installation & Start
```bash
cd ../frontend
npm install
npm run dev
```
The frontend application starts at `http://localhost:5173`.

---

## Database Seeding

To bootstrap system permissions, default roles (Super Admin, Admin, Manager, Employee), and the initial Super Admin account, run the database seed script:

```bash
cd backend
npm run seed
```

**Default Seed Credentials:**
- **Email**: `superadmin@erp.com`
- **Password**: `Admin123!`

---

## Production Deployment (Docker Compose)

The recommended production deployment path orchestrates the backend container, frontend static client, and a MongoDB container inside a private network, using Nginx to handle routing.

### 1. Production Dockerfiles
Ensure Dockerfiles exist in the `backend` and `frontend` directories.

#### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main"]
```

#### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Nginx Config (`frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend container
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Main Compose Orchestrator (`docker-compose.yml` at root)
Create a `docker-compose.yml` file at the root:
```yaml
version: '3.8'

services:
  database:
    image: mongo:6.0
    container_name: erp-mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    container_name: erp-backend
    restart: always
    depends_on:
      - database
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://database:27017/mini-erp
      - JWT_ACCESS_SECRET=prod_secret_access_key_xyz987!
      - JWT_REFRESH_SECRET=prod_secret_refresh_key_abc654!
      - JWT_ACCESS_EXPIRATION=15m
      - JWT_REFRESH_EXPIRATION=7d
      - UPLOAD_PATH=/app/uploads
    volumes:
      - uploads-data:/app/uploads
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    container_name: erp-frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  mongo-data:
  uploads-data:
```

### 3. Build & Run Containers
Run this command from the root directory:
```bash
docker compose up -d --build
```
Verify that all services are healthy:
```bash
docker compose ps
```

---

## Manual Production Deployment (Nginx & PM2)

If deploying to a VPS/bare-metal server (Ubuntu/Debian) without Docker, use Nginx as a reverse proxy and PM2 for NestJS process management.

### 1. Build and Run Backend using PM2
Install PM2 globally:
```bash
sudo npm install -g pm2
```
Navigate to backend, build, and register the application process:
```bash
cd backend
npm install --production
npm run build
pm2 start dist/main.js --name "mini-erp-api"
pm2 save
pm2 startup
```

### 2. Build Frontend
Build the static build assets:
```bash
cd ../frontend
npm install
npm run build
```
The output assets will be generated in `frontend/dist`. Move these files to your server web root (e.g. `/var/www/mini-erp`).

### 3. Configure Nginx Reverse Proxy
Create an Nginx server block config:
`/etc/nginx/sites-available/mini-erp`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Static Frontend files
    root /var/www/mini-erp;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxied to PM2 instance
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads Static Access Proxy
    location /uploads/ {
        alias /home/arise/Repo/mini-erp/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```
Enable the site configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mini-erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Production Security & Checklist

- [ ] **Change Default JWT Secrets**: Update `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to secure keys.
- [ ] **Secure Database Port**: Restrict access to MongoDB port `27017` to localhost/internal Docker networks. Enable Mongo Authentication.
- [ ] **SSL Configuration**: Install Let's Encrypt SSL certificates using Certbot:
  ```bash
  sudo apt-get install certbot python3-certbot-nginx
  sudo certbot --nginx -d yourdomain.com
  ```
- [ ] **CORS Settings**: Verify backend CORS settings allow requests only from verified domains.
- [ ] **Database Backups**: Schedule automated cron jobs to backup MongoDB using `mongodump`.
