const jwt = require("jsonwebtoken");
const sendEmail = require("../../service/sendEmail");
const fs = require("fs")
const QRCode = require('qrcode');
const bcrypt = require("bcrypt");
const { post } = require("../../router/user.router");
const commentModel = require("../../DB/Models/comment.model");
const postModel = require("../../DB/Models/post.model");
const userModel = require("../../DB/Models/user.model");
module.exports.addComment = async (req, res) => {
    // try {
    const { id } = req.params
    const { text } = req.body
    const user = await userModel.findById(req.user.id)
    if (!user) {
        res.status(400).json({ message: "no user" });
    } else {
        if (!req.file) {
            const newComment = new commentModel({ text, createdBy: req.user.id, postBy: id });
            const saveComment = await newComment.save();
            const updatecomment = await postModel.findByIdAndUpdate(id, { $push: { comment: saveComment._id } })
            res.status(200).json({ message: "done", saveComment });
        } else {
            const imageURL = req.file
            const newComment = new commentModel({ text, image: imageURL, createdBy: req.user.id, postBy: id });
            const saveComment = await newComment.save();
            const updatecomment = await userModel.findByIdAndUpdate(id, { $pull: { comment: saveComment._id } })
            res.status(200).json({ message: "done", saveComment });
        }
    }
    // } catch (error) {
    //     res.status(500).json({ message: "error catch", error });
    // }
}
module.exports.updateComment = async (req, res) => {
    // try {
    const user = await userModel.findById(req.user.id)
    if (!user) {
        res.status(400).json({ message: "no user" });
    } else {
        if (user._id == req.user.id) {
            if (req.error) {
                const { text } = req.body
                const updatepost = await postModel.findOneAndUpdate({ createdBy: req.user._id }, { text });
                res.status(200).json({ message: "done", updatepost });
            } else {
                const { text } = req.body;
                const imageURL = [];
                req.files.forEach(file => {
                    imageURL.push(`${req.destination}/${file.filename}`)
                });
                const newPost = await postModel.findOneAndUpdate({ createdBy: req.user._id }, { text, image: imageURL });
                res.status(200).json({ message: "done", newPost });
            }
        }
    }

    // } catch (error) {
    //     res.status(500).json({ message: "error catch", error });
    // }

}

module.exports.softdelete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(req.user.id)
        const post = await postModel.findById(id)
        if (!user) {
            res.status(400).json({ message: "not have this user" });
        } else {
            if (user._id == post.createdBy || user.role == "admin") {
                const postupdate = await postModel.findByIdAndUpdate(id, { isDeleted: true })
                const userUpdate = await userModel.findByIdAndUpdate(user._id, { $pull: { isPost: post._id } })
                res.status(400).json({ message: "delete post", postupdate });
            } else {
                res.json({ message: "done", token })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "done", token })
    }
}
module.exports.likePostorUnlike = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        const post = await postModel.findById(id)
        if (!user) {
            res.status(200).json({ message: "not have this user" });
        } else {
            if (user._id == post.createdBy || user.role == "admin") {
                if (post.likes.includes(user._id)) {
                    const postupdate = await postModel.findByIdAndUpdate(id, { $pull: { likes: user._id } })
                    res.status(200).json({ message: "un like to post ", postupdate })
                } else {
                    const postupdate = await postModel.findByIdAndUpdate(id, { $push: { likes: user._id } })
                    res.status(200).json({ message: "like post", postupdate })
                }
            } else {
                res.status(400).json({ message: "not admin user or owner" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error })

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
                    const imageURl = `${req.destination}/${req.file.filename}`
                    const userprofile = await userModel.findByIdAndUpdate(user._id, { profilePic: imageURl })
                    res.status(200).json({ message: "done update picture", userprofile });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}
module.exports.alluser = async (req, res) => {
    try {
        const posts = await postModel.find({}).populate({
            path: "createdBy likes"
        })
        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ message: "error catch", error });
    }
}

