const mongooseConnection = require('../mongoConnection')

const Schema = mongooseConnection.Schema;

const User = new Schema({
    name: { type: String, required: false },
    username: { type: String, required: false },
    avatar: { type: String, required: false },
    phone: { type: String, max: 16, unique: true, required: true },
    bio: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongooseConnection.model('User', User);
