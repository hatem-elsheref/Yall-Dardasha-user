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

        if (userInfo.username != null && userInfo.name != null) {
            verified = true
        }


        return response.json({ code: 200, user: userInfo, accountVerified: verified })
    } catch (error) {
        return response.json({ code: 400, message: error.message })
    }
}



module.exports.getUserById = async (request, response) => {

    let userInfo = null

    try {
        userInfo = await User.findOne({ _id: request.body._id })


        if (userInfo) {
            let followers_count = userInfo.followers.length
            let following_count = userInfo.following.length
            let user = { ...userInfo._doc, followers_count: followers_count, following_count: following_count }
            return response.json({ code: 200, user: user })
        }

        return response.json({ code: 200, user: null })
    } catch (error) {
        console.log(userInfo);
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

                const UN_KNOWN = 'un_known'

                const userObject = {
                    name: request.body.name,
                    username: request.body.username,
                    bio: request.body.bio.length === 0 ? UN_KNOWN : request.body.instagram,
                    instagram: request.body.instagram.length === 0 ? UN_KNOWN : request.body.instagram,
                    twitter: request.body.twitter.length === 0 ? UN_KNOWN : request.body.twitter,
                    avatar: request.body.avatar ?? UN_KNOWN
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
    return response.status(200).json({ user: userInfo })
}



module.exports.updateProfile = async (request, response) => {

    let authUserInfo = await User.findOne({ _id: request.body.user_id })

    const UN_KNOWN = 'un_known'

    const userObject = {
        name: request.body.name,
        bio: request.body.bio.length === 0 ? authUserInfo.bio : request.body.bio,
        instagram: request.body.instagram.length === 0 ? authUserInfo.instagram : request.body.instagram,
        twitter: request.body.twitter.length === 0 ? authUserInfo.twitter : request.body.twitter
    }

    await User.updateOne({ _id: authUserInfo._id }, { ...authUserInfo._doc, ...userObject})

    return response.status(200).json({ message: "success" })
}

/*
ahmed want to follow ali
ahmed will call follo api and send ali id with the request
i will get ahmed id from jwt
add ali'id in following array in ahmed's record
add ahmed'id in the following array of ali's record
*/
module.exports.follow = async (request, response) => {
    let authUserInfo = await User.findOne({ _id: request.body.user_id })
    let otherUserInfo = await User.findOne({ _id: request.body.followed_user_id })
    if (authUserInfo && otherUserInfo) {


        let following = authUserInfo.following
        following.push(otherUserInfo._id)
        let uniqueFollowing = following.filter(function (item, pos) {
            return following.indexOf(item) == pos;
        })
        let obj1 = { ...authUserInfo._doc, following: uniqueFollowing }



        let followers = otherUserInfo.followers
        followers.push(authUserInfo._id)
        let uniqueFollowers = followers.filter(function (item, pos) {
            return followers.indexOf(item) == pos;
        })
        let obj2 = { ...otherUserInfo._doc, followers: uniqueFollowers }



        await User.updateOne({ _id: authUserInfo._id }, obj1)
        await User.updateOne({ _id: otherUserInfo._id }, obj2)

        return response.status(200).json({ message: "success" })


    } else {
        return response.status(200).json({ message: "undefined user/follower" })
    }
}

/*return list of all users in followers array in the auth user*/
module.exports.getMyFollowers = async (request, response) => {

    let authUserInfo = await User.findOne({ _id: request.body.user_id })
    let followers = await User.find({ _id: { $in: [...authUserInfo.followers] } })

    return response.status(200).json({ followers: followers })
}


/*return list of all users in following array in the auth user*/
module.exports.getMyFollowing = async (request, response) => {

    let authUserInfo = await User.findOne({ _id: request.body.user_id })
    let following = await User.find({ _id: { $in: [...authUserInfo.following] } })

    return response.status(200).json({ following: following })
}