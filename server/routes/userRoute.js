import express from "express"
import upload from "../middleware/upload.js"; 

import { create, deleteUser, getAllUsers, getUserById, update, searchUsers, filterUsers, uploadPhoto, deletePhoto } from "../Controller/userController.js"

const route = express.Router();


route.get("/users/filter", filterUsers);
route.get("/search", searchUsers);
route.post("/user", create)
route.get("/users", getAllUsers)
route.get("/user/:id", getUserById);
route.put("/update/user/:id", update);
route.delete("/delete/user/:id", deleteUser)
route.post("/user/:id/photo",     upload.single("photo"), uploadPhoto);   
route.delete("/user/:id/photo",   deletePhoto); 

export default route;