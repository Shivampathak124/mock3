const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const {
        headers: { authorization },
    } = req;
    if (!authorization) {
        res.json({ message: "Unauthorized" });

    }
    const token = authorization.split(" ")[1];
    jwt.verify(token, "Mock3", (err, decoded) => {
        if (err) {
            return res.json({message: "Unauthorized"})
        }
        req.userID = decoded.userID;
        next();
    })
}


module.exports = {authenticate}
