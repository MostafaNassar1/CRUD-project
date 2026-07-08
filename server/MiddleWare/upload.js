import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder:        "crud-uploads",
            public_id:     `user_${req.params.id}_${Date.now()}`,
            resource_type: "auto",
        };
    }
});

// file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt|/;
    const extValid = allowedTypes.test(file.originalname.toLowerCase());
    if (extValid) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed"));
    }
};

const upload = multer({
    storage, 
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
});

export default upload;