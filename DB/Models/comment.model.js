const mongoose = require("mongoose")
const commentSchema = mongoose.Schema({
    text: String,
    postBy: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    deletedby: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    isDeleted: { type: Boolean, default: false },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    image: String
})
const commentModel = mongoose.model('comment', commentSchema)
module.exports = commentModel