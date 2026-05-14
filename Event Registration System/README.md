# Event Registration System (ERS)

A full-stack event management and registration platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. This project features Role-Based Access Control (RBAC), a themed UI with Dark/Light mode, and a robust backend.

## 🚀 Features

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full control over events (Create, Read, Update, Delete) and visibility into all system registrations.
  - **User**: Can browse events, view details, register for events, and manage (view/cancel) their own registrations.
- **Dark/Light Mode**: Seamless theme switching using CSS Variables and React Context.
- **Secure Authentication**: JWT-based authentication with protected API routes.
- **Responsive Design**: Modern UI built with CSS Modules that works on mobile and desktop.
- **Seeded Data**: Pre-configured accounts and events for immediate testing.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose), JWT, Bcrypt.
- **Frontend**: React (Vite), TypeScript, CSS Modules, Axios, React Router.
- **Tools**: `tsx` for high-performance ESM/TypeScript execution.

## 📂 Project Structure

```text
Event Registration System/
├── backend/            # Express.js API
│   ├── src/
│   │   ├── config/     # Database & Token config
│   │   ├── controllers/# API logic
│   │   ├── middleware/ # Auth & RBAC middleware
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── seeder.ts   # Database seeder script
│   └── .env.example    # Backend environment template
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Theme & Auth state
    │   ├── pages/      # Route views
    │   ├── services/   # API communication
    │   └── styles/     # Global & Module CSS
    └── .env.example    # Frontend environment template
```

## 🔑 Seeded Credentials

To test the system immediately, run the seeder command and use these credentials:

| Role  | Email               | Password      |
|-------|---------------------|---------------|
| Admin | `admin@example.com` | `password123` |
| User  | `user@example.com`  | `password123` |

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB running locally or a cloud URI.

### 1. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file from the example: `cp .env.example .env` (or manually copy)
4. Seed the database: `npm run seed`
5. Start development server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file from the example: `cp .env.example .env`
4. Start development server: `npm run dev`

## 🛡️ Security & RBAC Logic

- **Registration**: All public registrations are strictly assigned the `User` role.
- **Admin Access**: Admin privileges are managed via seeded data or direct database updates.
- **API Protection**: Middlewares verify JWT tokens and check user roles before allowing sensitive operations (e.g., creating an event).
