import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    
    const token = req.cookies.accessToken;

    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError"){
        res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({message: "Invalid token"});
}
};

export default authMiddleware;