# 🍽️ Restaurant Management System

A full-stack **Restaurant Management System (RMS)** built as part of the **CodeAlpha Backend Development Internship**. The system allows restaurant staff to manage menus, track orders, reserve tables, and monitor inventory through a sleek, responsive web interface with support for both **dark and light modes**.

---

## 🌟 Features

- 🔐 **JWT Authentication** — Secure login with role-based access (Admin / Staff)
- 📋 **Menu Management** — Create, edit, delete menu items with category filtering
- 📝 **Order Tracking** — Place orders, track real-time status (Pending → Preparing → Ready → Served)
- 🪑 **Table Management** — Reserve, release, and monitor table availability
- 📦 **Inventory Tracking** — Monitor stock levels with low-stock alerts
- 📊 **Live Dashboard** — Today's orders, revenue, active tables, and alerts at a glance
- ⚡ **Redis Caching** — Fast response times with server-side caching
- 🌙☀️ **Dark / Light Mode** — Persistent theme toggle saved in the browser

---

## 👥 Role-Based Access Control (RBAC)

The system features two distinct user roles to ensure data security and operational efficiency:

- **Admin Role (`admin`)**: Has full access to the entire system. Can create, edit, and permanently delete menu items, inventory stock, tables, and orders.
- **Staff Role (`staff`)**: Designed for daily restaurant operations. Staff can view the menu, view inventory, view tables, place new orders, and update order statuses (Pending → Preparing → Ready → Served). However, they cannot modify the core restaurant setup, permanently delete items, or create/edit tables.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (via Mongoose ODM) |
| **Caching** | Redis (via ioredis) |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs |
| **Frontend Build** | Vite |
| **Frontend Stack** | Vanilla HTML, CSS, JavaScript |
| **Security** | Helmet, CORS |
| **Logging** | Morgan |

---

## 📁 Project Structure

```
Restaurant Management System/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Redis, and env configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Auth, caching, error handling
│   │   ├── models/          # Mongoose schemas (User, MenuItem, Order, Table, Inventory)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── app.js           # Express app setup
│   │   ├── server.js        # Server entry point
│   │   └── seed.js          # Database seed script
│   ├── .env.example         # Environment variable template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── css/             # Design system + page styles
    │   └── js/              # API client, router, page modules
    ├── index.html           # SPA shell
    └── vite.config.js       # Proxy config for API calls
```

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://cloud.mongodb.com/) connection string
- [Redis](https://redis.io/) running locally **or** a [Redis Cloud](https://redis.io/try-free/) connection URL *(optional — the app runs without it)*

---

### 1. Configure Environment Variables

Navigate to the `backend/` folder and copy the example file:

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rms
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Generate a secure JWT secret** using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

### 3. Seed the Database

Populate the database with sample menu items, tables, inventory, and demo users:

```bash
cd backend
npm run seed
```

> ⚠️ This clears and replaces all existing data.

**Demo credentials created by the seed:**

| Role | Email | Password |
|:---|:---|:---|
| Admin | admin@rms.com | admin123 |
| Staff | staff@rms.com | staff123 |

---

### 4. Run the Application

**Start the backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Server runs at: `http://localhost:5000`

**Start the frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
App runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/auth/register` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login and receive a JWT |
| `GET` | `/auth/me` | ✅ | Get current user info |
| `GET` | `/menu` | ❌ | List all menu items |
| `POST` | `/menu` | ✅ | Add a menu item |
| `PUT` | `/menu/:id` | ✅ | Update a menu item |
| `DELETE` | `/menu/:id` | ✅ | Delete a menu item |
| `GET` | `/orders` | ✅ | List all orders |
| `POST` | `/orders` | ✅ | Place a new order |
| `PUT` | `/orders/:id/status` | ✅ | Update order status |
| `DELETE` | `/orders/:id` | ✅ | Delete an order |
| `GET` | `/tables` | ✅ | List all tables |
| `POST` | `/tables` | ✅ | Add a table |
| `PUT` | `/tables/:id/reserve` | ✅ | Reserve a table |
| `PUT` | `/tables/:id/release` | ✅ | Release a table |
| `GET` | `/inventory` | ✅ | List inventory items |
| `POST` | `/inventory` | ✅ | Add an inventory item |
| `PUT` | `/inventory/:id` | ✅ | Update inventory item |
| `DELETE` | `/inventory/:id` | ✅ | Delete inventory item |
| `GET` | `/dashboard/stats` | ✅ | Get live dashboard statistics |

---

## 🔒 Security Notes

- **Never commit your `.env` file** — it contains secrets. It is already in `.gitignore`.
- The `.env.example` file is safe to commit — it contains only placeholder values.
- JWT tokens expire after 7 days by default (configurable via `JWT_EXPIRES_IN`).
- Redis caching uses short TTLs (15–120 seconds) to keep data fresh.

---

## 👤 Author

**Kareem Tamer** — CodeAlpha Backend Development Internship
