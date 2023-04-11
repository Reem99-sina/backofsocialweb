const { endpoint } = require('../detailRouter/post/post.endpoint')
const { addPost, updatePost, softdelete, likePostorUnlike, allposts } = require('../detailRouter/post/post.service')
const { validateaddPost } = require('../detailRouter/post/post.validation')
const { auth } = require('../middleware/auth')
const { validateschema } = require('../middleware/validation')
const { myMulter, fileValdation } = require('../service/multer')

const router = require('express').Router()

router.post("/addPost/:id", auth(endpoint.addpost), myMulter("/postimage", fileValdation.image).array("image", 4), validateschema(validateaddPost), addPost)
router.patch("/updatePost", auth(endpoint.addpost), myMulter("/postimage", fileValdation.image).array("image", 4), validateschema(validateaddPost), updatePost)
router.patch("/softdelete/:id", auth(endpoint.admingetall), softdelete)
router.patch("/likePostorUnlike/:id", auth(endpoint.admingetall), likePostorUnlike)
router.get("/allposts", auth(endpoint.updatepassword), allposts)

module.exports = router