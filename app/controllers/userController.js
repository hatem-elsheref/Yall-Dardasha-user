const configurations = require('./../config')

const User = require('./../models/userModel')

const fetch = require('node-fetch')

const JWT = require('jsonwebtoken');


// const {apiKey, devEnvironment} = require('./../config')

// const Response = require('./../helpers/response')

module.exports.getUserByPhoneNumber = async (request, response) => {

    let userInfo = null
    let verified = false

    try {
        userInfo = await User.findOne({ phone: request.body.phone })

        if (userInfo == null) {
            userInfo = await User.create({ phone: request.body.phone })
        }

        if (userInfo.username != null && userInfo.name != null){
            verified = true
        }


        return response.json({ code: 200, user: userInfo, accountVerified: verified })
    } catch (error) {
        return response.json({ code: 400, message: error.message })
    }
}

module.exports.createNewUser = async (request, response) => {

    try {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            await JWT.verify(token, configurations.jwt.secret, configurations.jwt.options, async (err, user) => {
                if (err) {
                    return response.status(403).json({ code: 403, message: 'expired token' });
                }

                const userObject = {
                    name: request.body.name,
                    username: request.body.username,
                    bio: request.body.bio ?? null,
                    twitter: request.body.twitter ?? null,
                    instagram: request.body.instagram ?? null,
                }

                // check if user found before
                let userInfo = await User.findOne({ _id: user.user_id })
                // let userInfo = await User.findOne().or([{ _id: user.user_id}, {username : request.body.username }])

                if (userInfo == null) {
                    return response.json({
                        code: 400,
                        status: 'fail',
                        message: 'try to verify code first / invalid token'
                    })
                }

                let usernameExist = await User.findOne({ username: request.body.username })

                if (usernameExist != null) {
                    return response.json({
                        code: 400,
                        status: 'fail',
                        message: 'account already exist phone/username must be unique'
                    })
                }

                userObject.phone = userInfo.phone

                await User.updateOne({ _id: user.user_id }, userObject)

                return response.json({
                    code: 200,
                    status: 'success',
                    message: 'account updated successfully',
                    data: {
                        accountVerified: true
                    }
                })

            });
        } else {
            return response.status(403).json({ code: 403, message: 'no token' });
        }
    } catch (Error) {
        return response.status(403).json({ code: 403, message: 'expired token ' + Error.message });
    }

}

module.exports.getUser = async (request, response) => {
    let userInfo = await User.findOne({ _id: request.body.user_id })
    return response.status(200).json({user: userInfo})
}