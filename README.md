# Hyper Play - Sports E-commerce Platform

A full-stack web application that enables users to design and customize sports jerseys with real-time visualization, manage orders through a multi-role system, and process payments securely.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Development](#development)

## Project Overview

Hyper Play is a comprehensive e-commerce platform designed for sports jersey customization. It supports three user roles:

- **Customers**: Browse, design, and purchase custom jerseys
- **Manufacturers**: Receive design orders and prepare PDFs for production
- **Admins**: Manage products, monitor orders, and assign work to manufacturers

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (version 15)
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **AWS S3** - Image storage
- **Stripe** - Payment processing
- **Multer** - File upload handling
- **PDFKit** - PDF generation
- **CORS** - Cross-origin resource sharing

### Frontend (Customer)

- **React** 19 - UI library
- **Vite** 7 - Build tool
- **Tailwind CSS** - Styling
- **React Router** 7 - Navigation
- **Redux** - State management

### Admin Dashboard

- **React** 19 - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety for UI components
- **Tailwind CSS** - Styling
- **Custom UI Components** - Built with shadcn/ui patterns

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy & static file serving

## Features

### Customer Features

- ✅ User registration and authentication
- ✅ Browse available sports jerseys
- ✅ Shopping cart management
- ✅ Secure checkout with Stripe payment integration
- ✅ Order tracking and history
- ✅ Product filtering and search

### Manufacturer Features

- ✅ View assigned orders
- ✅ Generate production-ready PDF with design specifications
- ✅ Order management dashboard
- ✅ Manufacturer authentication

### Admin Features

- ✅ Product management (add, edit, delete)
- ✅ Image upload to AWS S3
- ✅ View all customer orders
- ✅ Assign orders to manufacturers
- ✅ Manufacturer management
- ✅ Sales analytics and reporting
- ✅ Customer management
- ✅ System settings and configuration

## Project Structure

```
project-hyper-play/
├── backend/                          # Express API Server
│   ├── controllers/                  # Route handlers
│   │   ├── authController.js
│   │   ├── adminProductController.js
│   │   ├── adminOrderController.js
│   │   ├── manufacturerOrderController.js
│   │   ├── orderController.js
│   │   ├── customerController.js
│   │   └── paymentController.js
│   ├── routes/                       # API route definitions
│   ├── middleware/                   # Auth & validation middleware
│   ├── utils/                        # Helper functions (S3, PDF, upload)
│   ├── server.js                     # Express app entry point
│   ├── db.js                         # Database configuration
│   ├── seed.js                       # Database seeding
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                         # Customer-facing React app
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── Auth/                 # Login, Register, ForgotPassword
│   │   │   └── User/                 # Homepage, Products, Cart, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile
│
├── admin/                            # Admin dashboard React app
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ui/                   # Button, Input, Badge, Table, etc.
│   │   │   └── ManufacturerSidebar.jsx
│   │   ├── pages/                    # Admin & Manufacturer pages
│   │   │   ├── admin/                # Dashboard, Products, Orders, etc.
│   │   │   └── manufacturer/         # Manufacturer dashboard
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml                # Multi-container orchestration
└── README.md                         # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ or Docker installed
- PostgreSQL 15 (optional if using Docker)
- Git
- AWS S3 account (for image storage)
- Stripe account (for payments)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**

```bash
git clone <repository-url>
cd project-hyper-play
```

2. **Create environment files**

Create `backend/.env`:

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
JWT_SECRET=your_jwt_secret_key_here
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. **Start all services**

```bash
docker-compose up --build
```

Services will be available at:

- Frontend: http://localhost:3000
- Admin: http://localhost:3001
- Backend API: http://localhost:5000
- Database: localhost:5434

4. **Seed the database** (optional)

```bash
docker-compose exec backend node seed.js
```

### Option 2: Local Development Setup

#### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
JWT_SECRET=your_jwt_secret_key_here
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start the backend:

```bash
npm start
# Server runs on http://localhost:5000
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

#### Admin Setup

```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:5174
```

#### Database Setup

```bash
# Install PostgreSQL if not already installed
# Create database
createdb sports

# Run migrations/seed (if available)
cd backend
node seed.js
```

## API Endpoints

### Authentication Routes

```
POST   /api/register              - Customer registration
POST   /api/login                 - Customer login
POST   /api/admin/login           - Admin login
POST   /api/manufacturer/login     - Manufacturer login
```

### Product Routes (Admin)

```
GET    /api/admin/products        - Get all products
GET    /api/admin/products/:id    - Get product by ID
POST   /api/admin/products/add    - Add new product (with image upload)
PUT    /api/admin/products/:id    - Update product (with image upload)
DELETE /api/admin/products/:id    - Delete product
```

### Order Routes (Customer)

```
POST   /api/order/create          - Create order (requires auth)
GET    /api/order/orders          - Get customer's orders (requires auth)
GET    /api/order/orders/:order_id - Get specific order (requires auth)
```

### Admin Order Routes

```
GET    /api/admin/orders          - Get all orders
PUT    /api/admin/orders/:orderId/assign-manufacturer - Assign order to manufacturer
GET    /api/admin/get-manufacturers - Get list of manufacturers
```

### Manufacturer Order Routes

```
GET    /api/manufacturer/orders   - Get assigned orders
GET    /api/manufacturer/orders/:id/pdf - Generate order PDF
```

### Customer Routes

```
GET    /api/customer/products     - Get all products
GET    /api/customer/cart         - Get shopping cart (requires auth)
POST   /api/customer/cart         - Add to cart (requires auth)
```

### Payment Routes

```
POST   /api/payments              - Process payment with Stripe
```

## Environment Variables

Create `.env` files in the `backend` folder with the following variables:

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `PORT`                   | Server port (default: 5000)          |
| `DB_HOST`                | PostgreSQL host                      |
| `DB_USER`                | Database user                        |
| `DB_PASSWORD`            | Database password                    |
| `DB_NAME`                | Database name                        |
| `DB_PORT`                | Database port (default: 5432)        |
| `JWT_SECRET`             | Secret key for JWT signing           |
| `AWS_REGION`             | AWS region for S3                    |
| `AWS_ACCESS_KEY_ID`      | AWS access key                       |
| `AWS_SECRET_ACCESS_KEY`  | AWS secret key                       |
| `AWS_S3_BUCKET`          | S3 bucket name                       |
| `STRIPE_SECRET_KEY`      | Stripe API secret key                |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key               |
| `NODE_ENV`               | Environment (development/production) |

## Docker Deployment

### Build Images

```bash
docker-compose build
```

### Run Containers

```bash
docker-compose up
```

### Stop Containers

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend-user
docker-compose logs -f frontend-admin
docker-compose logs -f db
```

### Access Database in Docker

```bash
docker-compose exec db psql -U postgres -d sports
```

## Development

### Backend Development

```bash
cd backend
npm start
```

The API server will start on port 5000 and automatically restart on file changes (if using nodemon).

### Frontend Development

```bash
cd frontend
npm run dev
```

Vite will serve the app with hot module replacement (HMR) enabled.

### Admin Development

```bash
cd admin
npm run dev
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Admin
cd admin
npm run build

# Backend is ready as-is
```
