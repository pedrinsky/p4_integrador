const verificarRolAdmin = (req, res, next) => {
    if (req.user && req.user.rol === "administrador") {
        return next();
    }
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });
};

export default verificarRolAdmin;