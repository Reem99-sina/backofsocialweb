const bcrypt = require('bcrypt')
const mongoose = require("mongoose")
// const cryptojs = require("crypto-js")
const userSchema = mongoose.Schema({
    userName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true
    }, age: {
        type: Number,
        required: true
    }, phone: String,
    confirmemail: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId },
    isPost: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    role: { type: String, default: "User" },
    online: { type: Boolean, default: false },
    profilePic: String,
    coverImage: Array,
    code: String,
    lastSeen: String
}, {
    timestamps: true
})
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, Number(process.env.saltRound))
    next()
    console.log(this)
})
const userModel = mongoose.model("user", userSchema)
module.exports = userModel