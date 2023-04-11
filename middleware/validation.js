const schemaKey = ['body', 'params', 'headers', 'query']
module.exports.validateschema = (schema) => {
    return (req, res, next) => {
        const validerrarr = []
        schemaKey.forEach((key) => {
            if (schema[key]) {
                const validResult = schema[key].validate(req[key])
                if (validResult.error) {
                    validerrarr.push(validResult.error.details)
                }
            }
        })
        if (validerrarr.length > 0) {
            res.json({ message: "error validate ", validerrarr })
        } else {
            next()
        }
    }
}