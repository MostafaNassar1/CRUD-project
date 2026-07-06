CRUD Application — Backend Project

A backend CRUD application built with Express.js, MongoDB. The backend uses Mongoose as an ORM to manage a User collection, exposing RESTful API endpoints for creating, reading, updating, and deleting users, along with a smart search and filter endpoint.

Tech Stack

Backend


Node.js
Express.js
MongoDB
Mongoose (ORM)
dotenv

Project Structure

CRUD-Application/
├── server/
│   ├── models/
│   │   └── userModel.js
│   ├── controllers/
│   │   └── userController.js
│   ├── routes/
│   │   └── userRoute.js
│   ├── .env
│   └── index.js

API Endpoints

Method Endpoint Description:
POST/api/user | Create a new user
GET/api/users | Get all users
GET/api/user/:id | Get user by ID
PUT/api/user/:id | Update user by ID
DELETE/api/user/:id | Delete user by ID
GET/api/search?q= | Search across all fields
GET/api/users/filter | Filter users by field
