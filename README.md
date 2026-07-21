# CRUD Application — Backend

A backend REST API built with **Express.js** and **PostgreSQL**. Uses **Prisma** as an ORM to manage a User collection, exposing RESTful API endpoints for creating, reading, updating, and deleting users, along with smart search, filter, file upload, JWT authentication, RBAC, and scheduled cron jobs.

---

## GitHub Repository
https://github.com/MostafaNassar1/CRUD-project

## Live Deployment
https://crud-project-1-303j.onrender.com

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

---

## Project Structure

```
server/
├── Controller/
│   ├── userController.js
│   └── authController.js
├── MiddleWare/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── upload.js
│   └── validator.js
├── routes/
│   ├── userRoute.js
│   └── authRoute.js
├── prisma/
│   ├── schema.prisma
│   ├── client.js
│   └── migrations/
├── crons/
│   └── userCron.js
├── .env
└── index.js
```

---

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database (Aiven)
- Cloudinary account

### Installation

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

## Cron Jobs

This project uses **node-cron** for scheduled tasks:

| Cron Job | Schedule | Description |
|---|---|---|
| Auto delete old photos | Every Sunday at midnight | Deletes photos older than 30 days from Cloudinary and clears DB |
| Daily report | Every day at midnight | Logs total users, admins, new users today, and users with photos |

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

