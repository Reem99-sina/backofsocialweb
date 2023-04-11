const Joi = require("joi");

module.exports.validateaddComment = {
    body: Joi.object().required().keys({
        text: Joi.string(),
        image: Joi.string()
    })
}
module.exports.validateeditComment = {
    body: Joi.object().required().keys({
        text: Joi.string(),
        image: Joi.string()
    })
}
module.exports.validate = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp('[a-z]{4}')),
    })
}

module.exports.validateconfirm = {
    params: Joi.object().required().keys({

        token: Joi.string()

    })
}
module.exports.validateupdatepassword = {
    body: Joi.object().required().keys({
        newPassword: Joi.string().required().pattern(new RegExp('[a-z]{4}')),
        oldPassword: Joi.string().required().pattern(new RegExp('[a-z]{4}')),
    })
}
module.exports.validateforget = {
    body: Joi.object().required().keys({
        code: Joi.number().required(),
        newPassword: Joi.string().required().pattern(new RegExp('[a-z]{4}')),
        email: Joi.string().email().required()
    })
}