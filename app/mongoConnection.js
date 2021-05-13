const {devEnvironment, mongo} = require('config')

const mongoose = require('mongoose')

await mongoose.connect( devEnvironment ? mongo.mongoDevelopmentUrl : mongo.mongoProductionUrl, mongo.options)

module.exports = mongoose;