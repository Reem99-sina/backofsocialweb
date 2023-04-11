const { roles } = require("../../middleware/auth");

module.exports.endpoint = {
    addComment: [roles.admin, roles.user],
    updatePicturepro: [roles.admin, roles.user],
    editcomment: [roles.admin, roles.user],
    admingetall: [roles.admin],
    addpost: [roles.admin, roles.user],
}