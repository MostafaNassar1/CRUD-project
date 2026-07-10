# CRUD Application — Backend

A backend REST API built with **Express.js** and **MongoDB**. Uses **Mongoose** as an ORM to manage a User collection, exposing RESTful API endpoints for creating, reading, updating, and deleting users, along with smart search, filter, file upload, and JWT authentication.

## Live Deployment
https://crud-project-1-303j.onrender.com


## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose (ORM)
- bcrypt
- jsonwebtoken
- Multer
- Cloudinary
- cookie-parser
- dotenv

---

## Project Structure

```
server/
├── Controller/
│   ├── userController.js
│   └── authController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── upload.js
│   └── validator.js
├── model/
│   └── userModel.js
├── routes/
│   ├── userRoute.js
│   └── authRoute.js
├── .env
└── index.js
```

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account


### Running the App

node index.js

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
| POST | `/api/user` | Create user | ✅ |
| PUT | `/api/user/:id` | Update user | ✅ |
| DELETE | `/api/user/:id` | Delete user | ✅ |

### Search & Filter
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/search?q=` | Search across all fields | ❌ |
| GET | `/api/users/filter` | Filter users with sorting | ❌ |

### Files
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/user/:id/photo` | Upload files | ✅ |
| DELETE | `/api/user/:id/photo` | Delete files | ✅ |

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

## Search Endpoint

Search across name, email, and address using a single query:

```
GET /api/search?q=Mos
GET /api/search?q=@gmail.com
GET /api/search?q=Beirut
GET /api/search?q=6a4934e4dce8e2a85435d56f
```

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

## User Model

```json
{
  "name": "Mostafa",
  "email": "mostafa@gmail.com",
  "address": "Beirut, Lebanon",
  "password": "hashed_password",
  "photo": []
}
```

---
