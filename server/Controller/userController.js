import prisma from "../prisma/client.js"
import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../utils/sendEmail.js";
import { accountDeletedEmail } from "../utils/emailTemplate.js";

const getResourceType = (url) => {
    const imageTypes = /\.(jpg|jpeg|png|svg)$/i;
    
    if (imageTypes.test(url)) return "image";
    return "raw";//for pdf, doc, txt
};

export const create = async(req, res) => {
    try {
        const { name, email, address, password } = req.body;

        const userExist = await prisma.user.findUnique({where: {email}});
        if(userExist){
            return res.status(400).json({message: "User already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const savedData = await prisma.user.create({
            data: {name, email, address, password: hashedPassword}
        });
        res.status(200).json(savedData);
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
};


export const getAllUsers = async(req, res) => {
    try {
        const userData = await prisma.user.findMany();
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
        const { id }= req.params;
        const userExist = await prisma.user.findUnique({where:{id}});
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
        const {id} = req.params;
        const userExist = await prisma.user.findUnique({where: {id}});
        if (!userExist) {
             return res.status(404).json({message: "User not found"});
        }
        const updatedData = await prisma.user.update({ where:{id},data: req.body })
        res.status(200).json(updatedData)
    } catch (error) {
       res.status(500).json({errorMessge:error.message}) 
    }
};


export const deleteUser = async (req,res) =>{
    try {
        const { id } = req.params;
        const userExist = await prisma.user.findUnique({where: {id}});
        if (!userExist) {
             return res.status(404).json({message: "User not found"});
        }

        await sendEmail(
            userExist.email,
            "Your Account Has Been Deleted",
            accountDeletedEmail(userExist.name)
        );

        await prisma.user.delete({where:{id}});
        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({errorMessge:error.message}) 
    }
};


export const searchUsers = async(req, res) => {
    try {
        const {q} = req.query;

        if(!q) {
            return res.status(400).json({message: "Search query is required"})
        }

        //search across name, email, address 
        const users = await prisma.user.findMany({
            where:{
            OR: [
                {name: {contains: q, mode: "insensitive"}},
                {email: {contains: q, mode: "insensitive"}},
                {address: {contains: q, mode: "insensitive"}},
            ]
        }
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

        const where = {};

        if(name)
            where.name = {contains: name, mode: "insensitive"};
        
        if(email)
            where.email = {contains: email, mode: "insensitive"};
        
        if(address)
            where.address = {contains: address, mode: "insensitive"};
        
        const orderBy = {};
        if(sort){
            if(sort.startsWith("-")){
                orderBy[sort.slice(1)] = "desc";
            }else {
                orderBy[sort] = "asc";
            }
        }

        const users = await prisma.user.findMany({where, orderBy});

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

        const userExist = await prisma.user.findUnique({where: {id}});
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
        const updatedUser = await prisma.user.update({
            where: {id},
            data: { photo: photoUrls}
    });

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

        const userExist = await prisma.user.findUnique({where: {id}});
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
        await prisma.user.update({where:{id},data: { photo: [] }});

        res.status(200).json({ message: "Files deleted successfully" });

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};