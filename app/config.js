module.exports = {
    serviceName : 'user service',
    serviceDescription : 'user service for create user , find user, update user, delete user',
    apiKey : '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    jwt : {
        secret : 'W7bwoFsqizrvyDUfQxdgSB2tN6JAmCYK',
        options: {
            expiresIn: '24h',
            algorithm: 'HS256'
        }
    },
    development : {
        port : 3001,
        url : 'http://localhost:3001'
    },
    production : {
        port : process.env.PORT,
        url : 'https://yalla-dardasha-user.herokuapp.com'
    },
    mongo : {
        mongoDevelopmentUrl : 'mongodb://localhost/gp_clubhouse',
        mongoProductionUrl : 'mongodb+srv://hatem:webserver@cluster0.t0ute.mongodb.net/clubhouse?retryWrites=true&w=majority',
        options : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    },
    devEnvironment : false
}
