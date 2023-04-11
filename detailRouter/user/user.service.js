const jwt = require("jsonwebtoken");
const userModel = require("../../DB/Models/user.model");
const sendEmail = require("../../service/sendEmail");
const QRCode = require('qrcode');
const bcrypt = require("bcrypt")

module.exports.signup = async (req, res) => {
    // try {
    const { userName, email, password, age, gender, role } = req.body;
    const newUser = new userModel({ userName, email, password, age, gender, role });
    const saveUser = await newUser.save();
    const userToken = jwt.sign({ id: saveUser._id }, process.env.jwtemail, { expiresIn: '24hr' });
    const URL = `${req.protocol}://${req.headers.host}/api/v1/user/confirmEmail/${userToken}`;
    const message = `<a href=${URL}>phz follow me to confirm u email</a>`;
    await sendEmail(saveUser.email, message);
    res.status(200).json({ message: "done" });
}
module.exports.confirmemail = async (req, res) => {
    // try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.jwtemail)
    if (!decoded) {
        res.status(200).json({ message: "error in jwt decoded" });
    } else {
        const user = await userModel.findById(decoded.id)
        if (!user) {
            res.status(200).json({ message: "not have this user" });
        } else {
            if (!user.confirmemail) {
                const updateuser = await userModel.findByIdAndUpdate(user.id, { confirmemail: true })
                res.status(200).json({ message: " confirmemail" });
            } else {
                res.status(200).json({ message: "u already confirmemail" });

            }
        }
    }

}

module.exports.signin = async (req, res) => {
    // try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        res.status(200).json({ message: "not have this user" });
    } else {
        if (!user.confirmemail) {
            res.status(200).json({ message: "not confirmemail" });
        } else {
            if (user.isBlocked) {
                res.status(200).json({ message: "u are blocked" });
            } else {
                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                    res.json({ message: "wrong password" })
                } else {
                    const token = jwt.sign({ id: user._id, isLogged: true }, process.env.jwtcode)
                    res.json({ message: "done", token })
                }

            }
        }
    }
}
module.exports.updatePassword = async (req, res) => {
    // try {
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(req.user.id)
    if (!user) {
        res.status(200).json({ message: "not have this user" });
    } else {
        const match = await bcrypt.compare(oldPassword, user.password)
        if (!match) {
            res.json({ message: "wrong password" })
        } else {
            const newpasswordmatch = await bcrypt.compare(newPassword, user.password)
            if (newpasswordmatch) {
                res.json({ message: "no need to update password" })
            } else {
                const newpassword = await bcrypt.hash(newPassword, Number(process.env.saltRound))
                const userupdate = await userModel.findByIdAndUpdate(user._id, { password: newpassword })
                res.json({ message: "done", userupdate })
            }
        }
    }
}
module.exports.updatePicture = async (req, res) => {
    try {
        if (req.error) {
            res.status(200).json({ message: "type of format wrong" });
        } else {
            if (req.user.id) {
                const user = await userModel.findById(req.user.id)
                if (!user) {
                    res.status(200).json({ message: "not have this user" });
                } else {
                    console.log(req.file.filename)

                    const imageURl = `${req.destination}${req.file.filename}`
                    const userprofile = await userModel.findByIdAndUpdate(user._id, { profilePic: imageURl })
                    res.status(200).json({ message: "done update picture", userprofile });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}
module.exports.sendcode = async (req, res) => {
    try {
        if (req.user.id) {
            const user = await userModel.findById(req.user.id)
            if (!user) {
                res.status(200).json({ message: "not have this user" });
            } else {
                const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
                const userprofile = await userModel.findByIdAndUpdate(user._id, { code })
                const message = `<p>the code i need is ${code}</p>`
                await sendEmail(user.email, message)
                res.status(200).json({ message: "done update picture", userprofile });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}
module.exports.forgetPassword = async (req, res) => {
    try {
        const { code, email, newPassword } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(200).json({ message: "not have this user" });
        } else {
            if (user.code != code) {
                res.status(400).json({ message: "In-valid auth code" })
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
                await userModel.findOneAndUpdate({ _id: user._id }, { password: hashedPassword, code: "" })
                res.status(200).json({ message: "Done" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}
module.exports.alluser = async (req, res) => {
    try {
        const users = await userModel.find({}).populate({
            path: "isPost"
        })
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}
module.exports.Qrcode = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        QRCode.toDataURL(`${user}`, function (err, url) {
            if (err) {
                res.status(400).json({ message: "QR err" })
            } else {
                console.log(url)
                res.json({ message: "QR", url })
            }
        })
    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}


