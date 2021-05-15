const { body, check} = require('express-validator')

const {apiKey} = require('./../config')

module.exports.allowedToAccess = (request, response, next) => {
    try {
        if (request.headers["api_key"] !== apiKey){
            return response.json({code : 401, user : null, message : 'not allowed to access this resource'})
        }
    }catch (Error){
        return response.json({code : 401, user : null, message : 'not allowed to access this resource'})
    }

    next()
}


module.exports.userValidator = () => {

    return [
        body('name','name is required').isLength({min : 4}),
        body('username', 'username is required').isLength({min : 3}),
        body('bio').isLength({min : 0}),
        body('twitter').isLength({min : 0}),
        body('instagram').isLength({min : 0}),
        // check('phone', 'phone field must be less than or equal 16 digits long and in ar-EG format').matches(/^[0-9]{11,16}$/, "i"),
    ]

}
