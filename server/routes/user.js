const route = require('express').Router();
const userController = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifyToken');

route.post('/register', userController.register);
route.post('/login', userController.login);
route.get('/get-profile', verifyAccessToken, userController.getCurrentUser);
route.post('/refreshtoken', userController.refreshToken);
route.get('/logout', verifyAccessToken, userController.logout);
route.get('/forgot-password', userController.forgotPassword);
route.put('/reset-password', userController.resetPassword);



module.exports = route