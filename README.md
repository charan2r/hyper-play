# Hyper Play - Sports E-commerce Platform

A full-stack web application that enables users to design and customize sports jerseys with real-time visualization, manage orders through a multi-role system, and process payments securely.

## Project Overview

Hyper Play is a comprehensive e-commerce platform designed for sports equipment browsing and buying. It supports three user roles:

- **Customers**: Browse and purchase sports equipment.
- **Manufacturers**: Receive orders and prepare for production
- **Admins**: Manage products, monitor orders, and assign work to manufacturers

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **AWS S3** - Image storage
- **Stripe** - Payment processing
- **Multer** - File upload handling

### Frontend

- **React** - UI library
- **Tailwind CSS** - Styling

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy & static file serving

## Features

### Customer Features

- ✅ User registration and authentication
- ✅ Browse available sports equipment
- ✅ Shopping cart management
- ✅ Secure checkout with Stripe payment integration
- ✅ Product filtering and search

### Manufacturer Features

- ✅ View assigned orders
- ✅ Order management dashboard

### Admin Features

- ✅ Product management (add, edit, delete)
- ✅ Image upload to AWS S3
- ✅ View all customer orders
- ✅ Assign orders to manufacturers
- ✅ Manufacturer management
- ✅ Customer management

## Setup Instructions

### Prerequisites

- Node.js 18+ or Docker installed
- PostgreSQL 15
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
GET    /api/admin/profile         - Get admin profile (requires auth)
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
POST   /api/order/verify-payment   - Verify payment (requires auth)
GET    /api/order/orders          - Get customer's orders (requires auth)
GET    /api/order/orders/:order_id - Get specific order (requires auth)
```

### Admin Order Routes

```
GET    /api/admin/orders          - Get all orders (requires auth)
PUT    /api/admin/orders/:orderId/assign-manufacturer - Assign order to manufacturer (requires auth)
PUT    /api/admin/orders/:orderId/status - Update order status (requires auth)
GET    /api/admin/get-manufacturers - Get list of manufacturers
```

### Manufacturer Order Routes

```
GET    /api/manufacturer/orders   - Get assigned orders
```

### Customer Routes

```
GET    /api/customer/all          - Get all customers (admin only)
GET    /api/customer/products     - Get all products
GET    /api/customer/cart         - Get shopping cart (requires auth)
POST   /api/customer/cart         - Add to cart (requires auth)
```

### Payment Routes

```
POST   /api/payments/webhook      - Stripe webhook for payment confirmation
```
