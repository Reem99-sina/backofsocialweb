const multer = require("multer")
const path = require("path")
const nanoId = require("nano-id")

const fs = require("fs")
const fileValdation = {
    image: ['image/jpeg', ' image/png', "image/jpg"]
}
const myMulter = (customPath, customValidate) => {
    const userPath = path.join(__dirname, `../uploads${customPath}`)
    if (!customPath) {
        customPath = 'general'
    }
    if (!fs.existsSync(userPath)) {
        fs.mkdirSync(userPath, { recursive: true })
    }

    function filterfile(req, file, cb) {
        if (customValidate.includes(file.mimtype)) {
            cb(null, true)

        } else {
            req.error = true;
            cb(null, false)
        }
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            req.destination = `uploads${customPath}`
            cb(null, userPath)
        }, filename: function (req, file, cb) {
            const fullfilename = nanoId() + "_" + file.originalname;
            req.fileimage = file.originalname;
            cb(null, fullfilename)
        }
    })
    const uploads = multer({ dest: userPath, limits: { fileSize: 625000 }, filterfile, storage })
    return uploads
}
module.exports = {
    myMulter, fileValdation
}