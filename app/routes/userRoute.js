const { getUserByPhoneNumber, createNewUser, getUser, getUserById, follow, getMyFollowers, getMyFollowing } = require('./../controllers/userController')

const { userValidator, allowedToAccess, verifyToken } = require('./../middlewares/validatorMiddleware')

const { checkValidationError } = require('./../helpers/validatorError')

const express = require('express')

const userRouter = express.Router()


userRouter.post('/info', allowedToAccess, getUserByPhoneNumber)

userRouter.post('/profile', verifyToken, getUserById)

userRouter.post('/user', verifyToken, getUser)

userRouter.post('/create', userValidator(), checkValidationError, createNewUser)


userRouter.post('/follow', verifyToken, follow)
userRouter.post('/following', verifyToken, getMyFollowing)
userRouter.post('/followers', verifyToken, getMyFollowers)


module.exports = userRouter;