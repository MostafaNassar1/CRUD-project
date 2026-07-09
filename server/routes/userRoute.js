import express from "express"
import upload from "../MiddleWare/upload.js";
import authMiddleware from "../MiddleWare/authMiddleware.js"; 

import { create, deleteUser, getAllUsers, getUserById, update, searchUsers, filterUsers, uploadPhoto, deletePhoto } from "../Controller/userController.js"

const route = express.Router();


route.get("/users/filter", filterUsers);
route.get("/search", searchUsers);
route.post("/user", authMiddleware, create)
route.get("/users", getAllUsers)
route.get("/user/:id", authMiddleware, getUserById);
route.put("/update/user/:id", authMiddleware, update);
route.delete("/delete/user/:id", authMiddleware, deleteUser)
route.post("/user/:id/photo",   authMiddleware, upload.array("photos", 5), uploadPhoto);   
route.delete("/user/:id/photo", authMiddleware, deletePhoto); 
route.get("" ,(req, res) => {
    res.json({message: "Server is healthy and managed by Mostafa", status:200});
})

export default route;