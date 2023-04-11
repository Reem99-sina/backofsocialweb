const Joi = require("joi");

module.exports.validatesignup = {
    body: Joi.object().required().keys({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp('[a-z]{4}')),
        cpassword: Joi.valid(Joi.ref("password")).required(),
        age: Joi.number().min(18),
        role: Joi.string()
    })
}
module.exports.validatesignin = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp('[a-z]{4}'))
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