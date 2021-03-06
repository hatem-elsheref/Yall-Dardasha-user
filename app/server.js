const configurations = require('./config')
const mongoClientForUserModel = require('./models/userModel')

const currentEnvironment = configurations.devEnvironment ? configurations.development : configurations.production

const express = require('express')

const bodyParser = require('body-parser')

const userService = require('./routes/userRoute')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(userService)



app.get('/about-service', function (request, response) {
    return response.send('Hello Yalla Dardasha  / service-name : ' + configurations.serviceName + ', service-description : ' + configurations.serviceDescription);
})

app.get('/reset-service', async function (request, response) {
    await mongoClientForUserModel.remove({})
    return response.json('mongo db removed')
})


app.get('/all', async function (request, response) {

    mongoClientForUserModel.find({}, function (err, users) {

        return response.send(users);
    });
})


app.listen(currentEnvironment.port, function () {
    console.log(`application running in ${currentEnvironment.url}`);
});