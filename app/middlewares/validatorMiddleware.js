const { body, check} = require('express-validator')
const {devEnvironment} = require('../config')
const {apiKey} = require('./../config')
const fetch = require('node-fetch')



module.exports.verifyToken = async (request, response, next) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': request.headers.authorization
        }
    }

    let api = '/verify-redis'
    let authResponse = null

    if (devEnvironment){
        authResponse = await fetch( 'http://localhost:3000' + api, options).then(res => res.json())
    }else{
        authResponse = await fetch('https://yalla-dardasha-otp.herokuapp.com' + api, options).then(res => res.json())
    }

    if (authResponse.status === true){
        request.body.user_id = authResponse.user
        return next();
    }

    return response.status(403).json({code: 403, message: "un authorized"});

}


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

module.exports.userValidatorForUpdate = () => {

    return [
        body('name','name is required').isLength({min : 4}),
        body('bio').isLength({min : 0}),
        body('twitter').isLength({min : 0}),
        body('instagram').isLength({min : 0}),
    ]

}
