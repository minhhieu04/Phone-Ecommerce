const route = require('express').Router()
const userController = require('../controllers/user')
const { verifyAccessToken } = require('../middlewares/verifyToken')

route.post('/register', userController.register)
route.post('/login', userController.login)
route.get('/get-profile', verifyAccessToken, userController.getCurrentUser)


module.exports = route