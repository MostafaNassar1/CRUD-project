import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register
export const register = async (req, res) => {
    try {
        const {name, email, address, password, role} = req.body;

        //check if user already exists
        const userExist = await prisma.user.findUnique({where: {email}});
        if(userExist){
            return res.status(400).json({message: "User already exists"});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const savedUser = await prisma.user.create({
           data:{
            name, 
            email, 
            address, 
            password: hashedPassword,
            role
           }
        });

        res.status(201).json({message: "User registered successfully", user: savedUser});
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const login= async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const userExist = await prisma.user.findUnique({where: {email}});
        if(!userExist){
            return res.status(404).json({message: "User not found"});
        }

        const match = await bcrypt.compare(password, userExist.password);
        if(!match){
            return res.status(401).json({message: "Invalid credentials"});
        }

        //create access token - add role
        const accessToken = jwt.sign(
            {id:userExist._id, email: userExist.email, role: userExist.role},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn:"15m"}
        );

        //Create refresh token - add role
        const refreshToken = jwt.sign(
            { id: userExist._id, role: userExist.role },
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d" }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true, //JS cannot access it
            secure: true, //only sent over HTTPS
            sameSite: "strict", //only sent to same site
            maxAge: 15 * 60 * 1000 //15 minutes in milliseconds
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 *60 * 1000
        });

        res.status(200).json({message: "Login succesful"})

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const refresh = async(req, res) => {
    try {
        
        //read refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message: "No refresh token provided"});
        }

        //verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        //Create new access token
        const newAccessToken = jwt.sign(
            {id: decoded.id},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: "15m"}
        );

        //send new access token as cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({message: "Access token refreshed successfully"});
    } catch (error) {
        res.status(401).json({message: "Invalid or expired refresh token"});
    }
};

//logout
export const logout = (req, res) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    res.status(200).json({message: "Logged out successfully"});
}