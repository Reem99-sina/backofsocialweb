const jwt = require("jsonwebtoken")
const userModel = require("../DB/Models/user.model")
module.exports.roles = {
    user: "User",
    admin: "Admin"
}
module.exports.auth = (accessRoles) => {
    return async (req, res, next) => {
        const headertoken = req.headers['authorization']
        if (!headertoken.startsWith(process.env.Bearer)) {
            res.json("error in token")
        } else {
            const token = headertoken.split(" ")[1]
            const decoded = jwt.verify(token, process.env.jwtcode)
            if (!decoded) {
                res.json({ message: "In-valid  Token" })
            } else {
                const user = await userModel.findById(decoded.id)
                if (!user) {
                    res.json({ message: "no user has id" })
                } else {
                    if (accessRoles.includes(user.role)) {
                        req.user = user;
                        next()
                    } else {
                        res.json({ message: "not role access" })
                    }
                }
            }
        }
    }
}