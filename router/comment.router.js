const { endpoint } = require('../detailRouter/comment/comment.endpoint')
const { addComment } = require('../detailRouter/comment/comment.service')
const { validateaddComment, validateeditComment } = require('../detailRouter/comment/comment.validation')
const { auth } = require('../middleware/auth')
const { validateschema } = require('../middleware/validation')

const router = require('express').Router()
router.post("/addComment/:id", auth(endpoint.addComment), validateschema(validateaddComment), addComment)
router.post("/updateComment", auth(endpoint.editcomment), validateschema(validateeditComment), addComment)

module.exports = router