const { getUserByPhoneNumber, createNewUser, getUser, getUserById, follow, getMyFollowers, getMyFollowing, updateProfile } = require('./../controllers/userController')

const { userValidator, userValidatorForUpdate, allowedToAccess, verifyToken } = require('./../middlewares/validatorMiddleware')

const { checkValidationError } = require('./../helpers/validatorError')

const express = require('express')

const userRouter = express.Router()

// check if user has account before or not for internally call
userRouter.post('/info', allowedToAccess, getUserByPhoneNumber)
// get user info with _id
userRouter.post('/profile', verifyToken, getUserById)
// get my (auth user)info
userRouter.post('/user', verifyToken, getUser)
// create account
userRouter.post('/create', userValidator(), checkValidationError, verifyToken, createNewUser)
// update account
userRouter.post('/update', userValidatorForUpdate(), checkValidationError, updateProfile)
// follow member
userRouter.post('/follow', verifyToken, follow)
// get my following
userRouter.post('/following', verifyToken, getMyFollowing)
// get my followers
userRouter.post('/followers', verifyToken, getMyFollowers)


module.exports = userRouter;