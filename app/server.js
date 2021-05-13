const config = require('./config/app')

const express = require('express')

const bodyParser = require('body-parser')

const userService = require('./routes/userRoute')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth/user', userService)


app.get('/me', function (request, response) {
    return response.send('Hello Yall Dardasha User Service');
})



app.listen(process.env.PORT || 80, function () {
    console.log(`application running in ${config.app_url}:${process.env.PORT || 80}`);
});