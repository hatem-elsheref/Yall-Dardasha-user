const User = require('./../models/userModel')

const fetch = require('node-fetch')

const {apiKey, devEnvironment, development} = require('./../config')

const Response = require('./../helpers/response')

module.exports.getUserByPhoneNumber = async (request, response) => {

    let userInfo = null;

    userInfo = await User.findOne({ phone: request.body.phone })

    response.json(userInfo === null ? { code: 404, user: null } : { code: 200, user: userInfo })
}

module.exports.createNewUser = async (request, response) => {


    // check if user found before or not (phone and username must be unique)
    let userInfo = await User.findOne().or([{ phone: request.body.phone}, {username : request.body.username }])

    if (userInfo !== null){
        return response.json(Response(400, 'fail', 'account already exist phone/username must be unique', [], []))
    }


    let user = {
        name : request.body.name,
        username : request.body.username,
        phone: request.body.phone,
        bio : request.body.bio ?? null,
        twitter : request.body.twitter ?? null,
        instagram : request.body.instagram ?? null,
    }


     userInfo = await User.create(user)

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