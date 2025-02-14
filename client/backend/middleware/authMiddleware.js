const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = verified;
        if (req.user.role !== "admin") return res.status(403).json({ message: "Admin Access Only" });
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};
