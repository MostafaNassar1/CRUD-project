import express from "express"
import upload from "../MiddleWare/upload.js";
import authMiddleware from "../MiddleWare/authMiddleware.js"; 
import roleMiddleware from "../MiddleWare/roleMiddleware.js";
import { create, deleteUser, getAllUsers, getUserById, update, searchUsers, filterUsers, uploadPhoto, deletePhoto } from "../Controller/userController.js"

const route = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
route.get("/users", getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
route.get("/user/:id", authMiddleware, getUserById);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user — Admin only
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - address
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mostafa
 *               email:
 *                 type: string
 *                 example: mostafa@gmail.com
 *               address:
 *                 type: string
 *                 example: Beirut
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
route.post("/user", authMiddleware, roleMiddleware(["admin"]), create);

/**
 * @swagger
 * /update/user/{id}:
 *   put:
 *     summary: Update user by ID — Admin only
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mostafa Updated
 *               email:
 *                 type: string
 *                 example: updated@gmail.com
 *               address:
 *                 type: string
 *                 example: Tripoli
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
route.put("/update/user/:id", authMiddleware, roleMiddleware(["admin"]), update);

/**
 * @swagger
 * /delete/user/{id}:
 *   delete:
 *     summary: Delete user by ID — Admin only
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
route.delete("/delete/user/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

/**
 * @swagger
 * /users/filter:
 *   get:
 *     summary: Filter users by name, email, address with sorting
 *     tags: [Search & Filter]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         example: Mostafa
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         example: gmail
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         example: Beirut
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         example: name
 *     responses:
 *       200:
 *         description: Filtered users
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
route.get("/users/filter", filterUsers);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search users across name, email and address
 *     tags: [Search & Filter]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: Mostafa
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Search query is required
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
route.get("/search", searchUsers);

/**
 * @swagger
 * /user/{id}/photo:
 *   post:
 *     summary: Upload multiple files for a user — Admin only
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: No files uploaded
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.post("/user/:id/photo", authMiddleware, roleMiddleware(["admin"]), upload.array("photos", 5), uploadPhoto);

/**
 * @swagger
 * /user/{id}/photo:
 *   delete:
 *     summary: Delete all files for a user — Admin only
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Files deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: No files found
 *       500:
 *         description: Server error
 */
route.delete("/user/:id/photo", authMiddleware, roleMiddleware(["admin"]), deletePhoto);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
route.get("", (req, res) => {
    res.json({ message: "Server is healthy and managed by Mostafa", status: 200 });
});

export default route;