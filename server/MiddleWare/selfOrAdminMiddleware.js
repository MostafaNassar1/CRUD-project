const selfOrAdminMiddleware = (req, res, next) => {
    const { id } = req.params;

    if (req.user.role === "admin" || req.user.id === id) {
        return next();
    }

    return res.status(403).json({ message: "Access Denied. You can only manage your own photo." });
};

export default selfOrAdminMiddleware;