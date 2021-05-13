const { getUserByPhoneNumber, createNewUser } = require('../controllers/userController')

const { userValidator, allowedToAccess } = require('./../middlewares/validatorMiddleware')

const { checkValidationError } = require('./../helpers/validatorError')


const express = require('express')

const userRouter = express.Router()

userRouter.get('/me', function (request, response) {
    return response.send('Hello Yall Dardasha User Service');
})

userRouter.post('/info', allowedToAccess, getUserByPhoneNumber)

userRouter.post('/create', allowedToAccess, userValidator(), checkValidationError, createNewUser)

module.exports = userRouter;