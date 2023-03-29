const jwt = require('jsonwebtoken');

const generateAccessToken = (uid, role) => jwt.sign(
    { _id: uid, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '3d' }
);

const generateRefreshToken = (uid) => jwt.sign(
    { _id: uid },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
)

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};