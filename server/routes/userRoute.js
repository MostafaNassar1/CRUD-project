import express from "express"
import upload from "../MiddleWare/upload.js";
import authMiddleware from "../MiddleWare/authMiddleware.js"; 
import roleMiddleware from "../Controller/roleMiddleware.js";

import { create, deleteUser, getAllUsers, getUserById, update, searchUsers, filterUsers, uploadPhoto, deletePhoto } from "../Controller/userController.js"

const route = express.Router();

//public routes
route.get("/users/filter", filterUsers);
route.get("/search", searchUsers);
route.get("/users", getAllUsers);

//protected routes
route.get("/user/:id", authMiddleware, getUserById);

//admin only
route.post("/user", authMiddleware, roleMiddleware(["admin"]), create)
route.put("/update/user/:id", authMiddleware, roleMiddleware(["admin"]), update);
route.delete("/delete/user/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);
route.post("/user/:id/photo",   authMiddleware, roleMiddleware(["admin"]), upload.array("photos", 5), uploadPhoto);   
route.delete("/user/:id/photo", authMiddleware, roleMiddleware(["admin"]), deletePhoto); 

route.get("" ,(req, res) => {
    res.json({message: "Server is healthy and managed by Mostafa", status:200});
})

export default route;