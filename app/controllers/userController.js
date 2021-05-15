const configurations = require('./../config')

const User = require('./../models/userModel')

const fetch = require('node-fetch')

const JWT = require('jsonwebtoken');


const {apiKey, devEnvironment} = require('./../config')

const Response = require('./../helpers/response')

module.exports.getUserByPhoneNumber = async (request, response) => {

    let userInfo = null
    let verified = true

     try {
         userInfo = await User.findOne({ phone: request.body.phone })

         if (userInfo == null){

             verified = false
             userInfo = await User.create({ phone: request.body.phone })
         }

         response.json({ code: 200, user: userInfo , accountVerified : verified})
     }catch (error){
         response.json({ code: 400, message: error.message})
     }
}

module.exports.createNewUser = async (request, response) => {

    const authHeader = request.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        await JWT.verify(token, configurations.jwt.secret, configurations.jwt.options,async (err, user) => {
            if (err) {
                return response.sendStatus(403);
            }


            console.log(user)
            return response.send('ok')

            // check if user found before or not (phone and username must be unique)
            let userInfo = await User.findOne().or([{ _id: user._id}, {username : request.body.username }])

            if (userInfo !== null){
                return response.json(Response(400, 'fail', 'account already exist phone/username must be unique', [], []))
            }








        });
    } else {
        response.sendStatus(401);
    }







    let user = {
        name : request.body.name,
        username : request.body.username,
        // phone: request.body.phone,
        bio : request.body.bio ?? null,
        twitter : request.body.twitter ?? null,
        instagram : request.body.instagram ?? null,
    }


     userInfo = await User.update({}, user)

    if (userInfo === null){
        return response.json(Response(400, 'fail', 'failed to create new account', [], []))
    }

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API_KEY': apiKey
        },
        body: JSON.stringify({ user_id: userInfo._id, device : 'android-phone'})
    }

    let api = '/api/v1/otp/get-token'
    let otpServiceResponse = {code : 400}

    if (devEnvironment){
        otpServiceResponse = await fetch('http://localhost:3000' + api, options).then(res => res.json())
    }else{
        otpServiceResponse = await fetch('https://yalla-dardasha-otp.herokuapp.com' + api, options).then(res => res.json())
    }

    if (otpServiceResponse.code === 200)    // return jwt token if success
        return response.json(otpServiceResponse)
    else
        return response.json(Response(400, 'fail', 'try again later', [], []))
}