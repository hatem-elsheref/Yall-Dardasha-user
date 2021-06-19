const { getUserByPhoneNumber, createNewUser, getUser } = require('./../controllers/userController')

const { userValidator, allowedToAccess , verifyToken} = require('./../middlewares/validatorMiddleware')

const { checkValidationError } = require('./../helpers/validatorError')

const express = require('express')

const userRouter = express.Router()


userRouter.post('/info', allowedToAccess, getUserByPhoneNumber)

userRouter.post('/user', verifyToken, getUser)

userRouter.post('/create', userValidator(), checkValidationError, createNewUser)

module.exports = userRouter;