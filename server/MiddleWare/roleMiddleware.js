const roleMiddleware = (roles) => {
    return (req, res, next) => {
        //check if the user's role is in the allowed roles array
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access Denied.Admins only."});
        }
        next();
    };
};

export default roleMiddleware;