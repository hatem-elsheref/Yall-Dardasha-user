const configs = require('./app')

const mongoose = require('mongoose')

const mongoCredentials = configs.db.mongo

const uri = "mongodb+srv://hatem:webserver@cluster0.t0ute.mongodb.net/clubhouse?retryWrites=true&w=majority";

const connect = async () => {

    // await mongoose.connect(mongoCredentials.connection_url, mongoCredentials.connection_options)
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
}


connect()

module.exports = mongoose;