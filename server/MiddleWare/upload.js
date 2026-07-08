import multer from "multer";
import path from "path";
import fs from "fs";

//create uploads folder if doesnt exist
const uploadDir = "uploads/photos";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

//storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `user_${req.params.id}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});

//file filter - images only
const fileFilter = (Req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|pdf|doc|txt/;
    const extValid = allowedTypes.test(path.extname(file.originalname));
    const mimeValid = allowedTypes.test(file.mimetype);

    if(extValid && mimeValid){
        cb(null, true);
    }else{
        cb(new Error("File type not allowed"));
    }
};

const upload = multer({
    storage, 
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
});

export default upload;