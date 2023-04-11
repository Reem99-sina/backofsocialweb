const mongoose = require("mongoose")
const postSchema = mongoose.Schema({
    text: String,
    image: { type: Array, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    deletedby: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    isDeleted: { type: Boolean, default: false }
})
const postModel = mongoose.model('post', postSchema)
module.exports = postModel