const route = require('express').Router();
const userController = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

route.post('/register', userController.register);
route.post('/login', userController.login);
route.get('/get-profile', verifyAccessToken, userController.getCurrentUser);
route.post('/refreshtoken', userController.refreshToken);
route.get('/logout', verifyAccessToken, userController.logout);
route.get('/forgot-password', userController.forgotPassword);
route.put('/reset-password', userController.resetPassword);
route.get('/get-all', [verifyAccessToken, isAdmin], userController.getUsers);
route.delete('/delete/:_id', [verifyAccessToken, isAdmin], userController.delUser);
route.put('/update-current', verifyAccessToken, userController.updateUser);
route.put('/update-user/:uid', [verifyAccessToken, isAdmin], userController.updateUserByAdmin);




module.exports = route