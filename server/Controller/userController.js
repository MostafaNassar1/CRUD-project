import mongoose from "mongoose";
import User from "../model/userModel.js"
import { v2 as cloudinary } from "cloudinary";

const getResourceType = (url) => {
    const imageTypes = /\.(jpg|jpeg|png|svg)$/i;
    
    if (imageTypes.test(url)) return "image";
    return "raw";//for pdf, doc, txt
};

export const create = async(req, res) => {
    try {
        const newUser = new User(req.body);
        const {email} = newUser;

        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({message: "User already exists."});
        }
        const savedData = await newUser.save();
        res.status(200).json(savedData);
    } catch (error) {
        res.status(500).json({errorMessge:error.message})
    }
};


export const getAllUsers = async(req, res) => {
    try {
        const userData = await User.find();
        if (!userData || userData.length === 0) {
            return res.status(404).json({message: "User Data not found"});
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({errorMessge:error.message})
    }
};


export const getUserById = async(req,res) =>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
             return res.status(404).json({message: "User not found"});
        }
         res.status(200).json(userExist);
    } catch (error) {
        res.status(500).json({errorMessge:error.message})
    }
} 


export const update = async(req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
             return res.status(404).json({message: "User not found"});
        }
        const updatedData = await User.findByIdAndUpdate(id, req.body, {
            new:true
        })
        res.status(200).json(updatedData)
    } catch (error) {
       res.status(500).json({errorMessge:error.message}) 
    }
};


export const deleteUser = async (req,res) =>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
             return res.status(404).json({message: "User not found"});
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({errorMessge:error.message}) 
    }
}


export const searchUsers = async(req, res) => {
    try {
        const {q} = req.query;

        if(!q) {
            return res.status(400).json({message: "Search query is required"})
        }
        
        //try searching by ID first
        if(mongoose.Types.ObjectId.isValid(q)){
            const userById = await User.findById(q);
            if(userById){
                return res.status(200).json(userById);
            }
        }

        //search across name, email, address using regex (case-insensitive)
        const users = await User.find({
            $or: [
                {name: {$regex: q, $options: "i"}},
                {email: {$regex: q, $options: "i"}},
                {address: {$regex: q, $options: "i"}},
            ]
        });
        if(users.length === 0){
            return res.status(404).json({message: "No user found"});
        }
        res.status(200).json(users);
    } catch (error) {
         res.status(500).json({errorMessge:error.message}) 
    }
}


export const filterUsers = async(req, res) => {
    try {
        const {name, email, address, sort} = req.query;

        const query = {};

        if(name){
            query.name = {$regex: name, $options: "i"};
        }
        if(email){
            query.email = {$regex: email, $options: "i"};
        }
        if(address){
            query.address = {$regex: address, $options: "i"};
        }

        let sortOption = {};
        if(sort){
            if(sort.startsWith("-")){
                sortOption[sort.slice(1)] = -1;
            }else {
                sortOption[sort] = 1;
            }
        }

        const users = await User.find(query).sort(sortOption);

        if(users.length === 0){
            return res.status(404).json({message: "No users found"});
        }
        res.status(200).json(users);
    } catch (error) {
         res.status(500).json({errorMessge:error.message})
    }
}


// upload photo
export const uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // delete old photos from cloudinary if exist
        if (userExist.photo && userExist.photo.length > 0) {
            for (const photoUrl of userExist.photo) {
                const publicId = photoUrl.split("/").slice(-2).join("/").split(".")[0];
                const resourceType = getResourceType(photoUrl); // ✅ detect type
                await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
            }
        }

       // get cloudinary URLs from req.files
        const photoUrls = req.files.map(file => file.path);

        // update user with new photo URL
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { photo: photoUrls },
            { new: true }
        );

        res.status(200).json({
            message: `${req.files.length} Photo uploaded successfully`,
            photos: photoUrls,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// delete photo
export const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userExist.photo || userExist.photo.length === 0) {
            return res.status(404).json({ message: "No files found for this user" });
        }

        // delete each file from cloudinary
        for (const photoUrl of userExist.photo) {
            const publicId = photoUrl.split("/").slice(-2).join("/").split(".")[0];
            const resourceType = getResourceType(photoUrl); // ✅ detect type
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }

        // clear photo array in DB
        await User.findByIdAndUpdate(id, { photo: [] });

        res.status(200).json({ message: "Files deleted successfully" });

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};