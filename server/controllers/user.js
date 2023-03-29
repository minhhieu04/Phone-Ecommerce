const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { findOne } = require('../models/user');
const { generateRefreshToken, generateAccessToken } = require('../middlewares/jwt')

const register = asyncHandler(async(req, res)=> {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email|| !password) {
        res.status(400).json({
            success: false,
            message: 'Please enter all fields'
         });
    }
    const user = await User.findOne({email})
    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        res.status(201).json({
            success: user ? true : false,
            message: user ? 'User created successfully. Please go login' : 'Something went wrong',
            user: newUser
        })
    }
})

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        });
    };
    const user = await User.findOne({email});
    const isCorrectPassword = await user.comparePassword(password);
    if (user && isCorrectPassword) {
        const { password, role, ...others } = user.toObject();
        const accessToken = generateAccessToken(user._id, role);
        const refreshToken = generateRefreshToken(user._id);
        await User.findByIdAndUpdate(user._id, {  refreshToken }, { new: true })
        res.cookie('refreshToken', refreshToken, { maxAge: 604800000, httpOnly: true });
        return res.status(200).json({
            success: true,
            statusCode: res.statusCode,
            accessToken,
            userData: others
        })
    } else {
        throw new Error('Invalid credentials!');
    }
});

const getCurrentUser = asyncHandler(async(req, res) => {
    const {_id} = req.user;
    await User.findById(_id).select('-refreshToken -password -role').then((user) => {
        res.status(200).json({
            success: true,
            user: user ? user : 'User not found'
        });
    })
    
})

module.exports = {
    register,
    login,
    getCurrentUser
}