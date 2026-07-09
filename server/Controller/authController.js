import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register
export const register = async (req, res) => {
    try {
        const {name, email, address, password} = req.body;

        //check if user already exists
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: "User already exists"});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = new User({
            name, 
            email, 
            address, 
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json({message: "User registered successfully", user: savedUser});
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const login= async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const userExist = await User.findOne({email});
        if(!userExist){
            return res.status(404).json({message: "User not found"});
        }

        const match = await bcrypt.compare(password, userExist.password);
        if(!match){
            return res.status(401).json({message: "Invalid credentials"});
        }

        //Create JWT token
        const token = jwt.sign(
            {
                id: userExist._id, email: userExist.email
            }, process.env.JWT_SECRET,
            {expiresIn: "7d" }
        );

        res.status(200).json({message: "Login succesful", token})

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}