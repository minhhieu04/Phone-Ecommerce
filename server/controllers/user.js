const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async(req, res)=> {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email|| !password) {
        res.status(400).json({
            success: false,
            message: 'Please enter all fields'
         });
    }
    const user = await User.create(req.body)
        res.status(201).json({
            success: user ? true : false,
            message: 'User created successfully',
            user
        })
})

const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Please enter all fields'
        });
        return;
    }
});

module.exports = {
    register
}