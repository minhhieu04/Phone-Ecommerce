const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const accessToken = req.headers.authorization.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
        });
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Require authentication",
    });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({
      success: false,
      message: "Require admin role",
    });
    next();
});

module.exports = {
  verifyAccessToken,
  isAdmin,
};
