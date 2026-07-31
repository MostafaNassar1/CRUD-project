# CRUD Application — Backend

A backend REST API built with **Express.js** and **PostgreSQL**. Uses **Prisma** as an ORM to manage a User collection, exposing RESTful API endpoints for creating, reading, updating, and deleting users, along with smart search, filter, file upload, JWT authentication, RBAC, and scheduled cron jobs.

---

## GitHub Repository
https://github.com/MostafaNassar1/CRUD-project

## Live Deployment
https://crud-project-1-303j.onrender.com

## API Documentation
https://crud-project-1-303j.onrender.com/api-docs

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (Aiven)
- Prisma (ORM)
- bcrypt
- jsonwebtoken
- Multer
- Cloudinary
- cookie-parser
- Morgan
- node-cron
- dotenv
- Nodemailer
- Swagger

---

## Features

### 🔐 Authentication & Authorization
- JWT authentication with HTTP-only cookies
- Refresh token rotation
- Role-Based Access Control (Admin/User)
- Secure logout (clears cookies)

### 👥 User Management
- Create, read, update, delete users
- Get user by ID
- Filter users by name, email, address
- Search across all fields
- Pagination-ready queries

### 📁 File Upload
- Upload multiple files (images, PDFs, documents)
- Cloudinary integration for permanent storage
- Auto-delete old files (30 days)
- Supported formats: JPG, PNG, JPEG, PDF, DOC, DOCX, TXT
- Max file size: 5MB

### ✉️ Email Notifications
- Welcome email on registration
- Account deletion notification
- Daily report with user statistics

### ⏰ Cron Jobs
- **Weekly cleanup:** Deletes photos older than 30 days from Cloudinary (every Sunday at midnight)
- **Daily report:** Sends user statistics via email (every day at midnight)

### 📚 API Documentation
- Interactive Swagger UI
- Complete request/response examples
- Authentication testing via cookies

---


## Project Structure

```
server/
├── Controller/
│ ├── userController.js 
│ └── authController.js 
├── MiddleWare/
│ ├── authMiddleware.js 
│ ├── roleMiddleware.js 
│ ├── upload.js 
│ └── validator.js 
├── routes/
│ ├── userRoute.js 
│ └── authRoute.js 
├── prisma/
│ ├── schema.prisma 
│ ├── client.js 
│ └── migrations/ 
├── crons/
│ └── userCron.js 
├── utils/
│ ├── emailTemplate.js 
│ └── sendEmail.js 
├── .env
├── index.js 
├── swagger.js 
└── package.json


```

---

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database (Aiven)
- Cloudinary account
- Gmail account (for email notifications)

### Installation

# Clone the repository
git clone https://github.com/MostafaNassar1/CRUD-project.git
cd CRUD-project/server

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root folder:
```
PORT=8000
DATABASE_URL="postgres://avnadmin:password@your-aiven-host:port/defaultdb?sslmode=require"
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BASE_URL=http://localhost:8000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com
```

### Running the App

```bash
node index.js
```

### Database Migration

```bash
npx prisma migrate dev --name init
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login and get tokens | ❌ |
| POST | `/api/auth/refresh` | Get new access token | ❌ |
| POST | `/api/auth/logout` | Logout and clear cookies | ❌ |

### Users
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/users` | Get all users | ❌ |
| GET | `/api/user/:id` | Get user by ID | ✅ |
| POST | `/api/user` | Create user | ✅ Admin only |
| PUT | `/api/update/user/:id` | Update user | ✅ Admin only |
| DELETE | `/api/delete/user/:id` | Delete user | ✅ Admin only |

### Search & Filter
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/search?q=` | Search across all fields | ❌ |
| GET | `/api/users/filter` | Filter users with sorting | ❌ |

### Files
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/user/:id/photo` | Upload files | ✅ Admin only |
| DELETE | `/api/user/:id/photo` | Delete files | ✅ Admin only |

---

## Authentication

This project uses **JWT Authentication** with **HTTP Only Cookies**.

- **Access Token** — expires in 15 minutes, used for accessing protected routes
- **Refresh Token** — expires in 7 days, used to get a new access token

### How to authenticate in Postman:
1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Cookies are set automatically
4. Access protected routes — cookies are sent automatically
5. Refresh → Use /api/auth/refresh to get new access token
6. Logout → Clears both cookies

---

## RBAC (Role Based Access Control)

This project implements RBAC with two roles:

| Role | Permissions |
|---|---|
| `admin` | Full access — create, read, update, delete, upload files |
| `user` | Read only — get all users, get user by ID |

### How to register as admin:
```json
{
  "name": "Mostafa",
  "email": "mostafa@gmail.com",
  "address": "Beirut",
  "password": "123456",
  "role": "admin"
}
```

---

## Search Endpoint

Search across name, email, and address using a single query:

```
GET /api/search?q=Mostafa
GET /api/search?q=@gmail.com
GET /api/search?q=Beirut
```

---

## Filter Endpoint

Filter users by field with sorting support:

```
GET /api/users/filter?name=Mostafa
GET /api/users/filter?email=gmail
GET /api/users/filter?address=Beirut
GET /api/users/filter?name=mo&email=gmail
GET /api/users/filter?sort=name
GET /api/users/filter?sort=-name
```

---

## File Upload

Upload multiple files (images and documents) for a user:

- Supported types: JPG, PNG, JPEG, PDF, DOC, DOCX, TXT
- Max file size: 5MB
- Files stored permanently on Cloudinary

```
POST /api/user/:id/photo → Body: form-data, key: photos, type: File
```

---

Email Templates
1. Welcome Email
Sent automatically after successful registration.

2. Account Deletion Email
Sent when an admin deletes a user account.

3. Daily Report Email
Sent every day at midnight with:

Total users count

Total admins

Regular users count

New users today

Users with uploaded photos

## Cron Jobs

This project uses **node-cron** for scheduled tasks:

| Cron Job | Schedule | Description |
|---|---|---|
| Auto delete old photos | Every Sunday at midnight | Deletes photos older than 30 days from Cloudinary and clears DB |
| Daily report | Every day at midnight | Generates and emails user statistics to admin |

---

## User Model

```json
{
  "id": "uuid",
  "name": "Mostafa",
  "email": "mostafa@gmail.com",
  "address": "Beirut, Lebanon",
  "password": "hashed_password",
  "role": "admin",
  "photo": [],
  "createdAt": "2026-07-16T00:00:00.000Z",
  "updatedAt": "2026-07-16T00:00:00.000Z"
}
```

---
Swagger Documentation
Access the interactive API documentation:

Development: http://localhost:8000/api-docs

Production: https://crud-project-1-303j.onrender.com/api-docs

---

---


# CRUD Project — Frontend

A React.js frontend built with **Vite** and styled with **Tailwind CSS**, designed to consume the backend REST API above. Implements authentication flow, role-based access control, protected routing, data caching, and an admin analytics dashboard on the client side.

---

## Tech Stack

- React.js
- Vite
- Tailwind CSS (with class-based dark mode)
- React Router DOM
- Axios
- @tanstack/react-query (data fetching, caching, mutations)
- Recharts (data visualization)
- React Toastify (notifications)
- Font Awesome (icons)
- axios-mock-adapter (development only)

---

## Features

### 🔐 Authentication
- Login and Registration pages with controlled forms
- Client-side validation on all inputs
- Error handling and display for failed requests
- Login session persistence across page refreshes (`localStorage`)
- Toast notifications on login, register, and logout

### 🧭 Routing & Navigation
- Client-side routing with React Router
- Public Home page with app overview
- Protected Routes — restrict access to Admin Panel, Dashboard, and Analytics based on login status
- Role-based access — only admins can access the Admin Panel and Analytics Dashboard

### 🌍 Global State Management
- React Context API (`AuthContext`) for managing logged-in user state across the app, with `localStorage` persistence and live sync on profile updates
- React Context API (`ThemeContext`) for global light/dark mode, persisted across sessions
- `@tanstack/react-query` for server-state management — caching, background refetching, and mutations with automatic cache invalidation

### 🎨 Dark Mode
- App-wide light/dark theme toggle (Tailwind v4 class-based strategy)
- Persisted user preference via `localStorage`
- Applied consistently across all pages and components

### 🖥️ Pages
- **Home** — public landing page with app overview, login/register entry points, and theme toggle
- **Login** — authenticates user, redirects to Admin Panel or Dashboard based on role
- **Register** — creates a new user account, redirects to Login on success
- **Dashboard** — displays and allows editing of the logged-in user's profile, including photo upload/removal
- **Admin Panel** — full user management: paginated table, search, sort, add/edit/delete users, with URL-synced state
- **Analytics Dashboard** *(admin only)* — overview stat cards, pie chart of user roles (Recharts), manual refresh, and CSV export

### 🧩 Components
- **Navbar** — dynamic navigation bar showing the logged-in user's name, avatar/photo, and role, with role-based links, theme toggle, and logout functionality
- **ProtectedRoute** — wrapper component that guards routes based on authentication and role

### 📋 Admin Panel Capabilities
- Paginated user table (URL-synced page state)
- Search by name, email, or address
- Sort by name/email (ascending or descending)
- Add, edit, and delete users via modal forms
- Icon-based actions (Font Awesome)
- Toast feedback on all actions

### 📊 Analytics Dashboard
- Real-time stat cards (Total Users, Total Admins, Total Regular Users)
- Interactive pie chart visualizing Admin vs User role breakdown
- Manual data refresh using React Query's `refetch`
- CSV export of the current user list

### 🔌 API Integration
- Centralized Axios instance (`api/axios.js`) configured with `withCredentials` for cookie-based authentication
- Environment-based API URL configuration using Vite's `import.meta.env`
- Mock API layer (`api/mockApi.js`) using `axios-mock-adapter` to simulate backend responses during frontend-only development, with `localStorage`-backed persistence, allowing full UI/auth/CRUD flow testing before backend integration

---

## Project Structure

```

client/
├── src/
│ ├── api/
│ │ ├── axios.js
│ │ └── mockApi.js
│ ├── components/
│ │ ├── Navbar.jsx
│ │ └── ProtectedRoute.jsx
│ ├── context/
│ │ ├── authContext.jsx
│ │ └── ThemeContext.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│ │ ├── AdminPanel.jsx
│ │ └── AnalyticsDashboard.jsx
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env
├── vercel.json
├── vite.config.js
└── package.json

```
---

## Getting Started

### Prerequisites
- Node.js installed

### Installation

```bash
cd CRUD-project/client
npm install
```

### Environment Variables

Create a `.env` file inside `client/`:
VITE_API_URL=http://localhost:8000/api

### Running the App

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

---

## Deployment

Deployed on **Vercel**, with a `vercel.json` rewrite rule to support client-side routing on refresh.

URL: crud-project-mkgtdix3u-mostafanassar1s-projects.vercel.app

Login Page to enter as Admin:
email: mostafa@gmail.com
password: 123456
---


