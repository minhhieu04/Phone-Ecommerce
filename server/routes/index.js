const userRoutes = require('./user')

const initRoutes = (app) => {
    app.use('/api/user', userRoutes)
}

module.exports = initRoutes