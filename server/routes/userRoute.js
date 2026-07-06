import express from "express"

import { create, deleteUser, getAllUsers, getUserById, update, searchUsers, filterUsers } from "../Controller/userController.js"

const route = express.Router();

route.get("/users/filter", filterUsers);
route.get("/search", searchUsers);
route.post("/user", create)
route.get("/users", getAllUsers)
route.get("/user/:id", getUserById);
route.put("/update/user/:id", update);
route.delete("/delete/user/:id", deleteUser)

export default route;