import mongoose from "mongoose";
import User from "../model/userModel.js"


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