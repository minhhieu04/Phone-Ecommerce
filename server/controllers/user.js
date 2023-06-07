const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { findOne } = require("../models/user");
const {
  generateRefreshToken,
  generateAccessToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }
  const user = await User.findOne({ email });
  if (user) throw new Error("User has existed");
  else {
    const newUser = await User.create(req.body);
    res.status(201).json({
      success: newUser ? true : false,
      message: newUser
        ? "User created successfully. Please go login"
        : "Something went wrong",
      user: newUser,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }
  const user = await User.findOne({ email });
  const isCorrectPassword = await user.isCorrectPassword(password);
  if (user && isCorrectPassword) {
    const { password, role, refreshToken, ...others } = user.toObject();
    const accessToken = generateAccessToken(user._id, role);
    const newRefreshToken = generateRefreshToken(user._id);
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 604800000,
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      statusCode: res.statusCode,
      accessToken,
      userData: others,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  await User.findById(_id)
    .select("-refreshToken -password -role")
    .then((user) => {
      res.status(200).json({
        success: true,
        user: user ? user : "User not found",
      });
    });
});

const refreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in session");
  const result = await jwt.verify(
    cookie.refreshToken,
    process.env.JWT_REFRESH_SECRET
  );
  const response = await User.findOne({
    _id: result._id,
    roles: result._roles,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.roles)
      : "Refresh token not matched",
  });
  // const result = await jwt.verify(cookie.refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decode) => {
  //     if (err) throw new Error('Invalid refresh token');
  //     const result = await User.findOne({_id: decode._id, roles: decode._roles});
  //     return res.status(200).json({
  //         success: result ? true : false,
  //         newAccessToken: result ? generateAccessToken(result._id, result.roles) : 'Refresh token not matched'
  //     });
  // });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookie");
  // Xoá trong db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // XOá trong cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken();
  await user.save();

  const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn trong vòng 15 phút.<a href="${process.env.SERVER_LOCAL_URL}user/reset-password/${resetToken}"> Click here</a>`;
  const data = {
    email,
    html,
    subject: "Xác nhận thay đổi mật khẩu!!!",
  };
  const result = await sendMail(data);
  res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new Error("Missing token or password");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid password reset token");
  user.password = password;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Updated password" : "Something went wrong!!",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const result = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: result ? true : false,
    data: result,
  });
});

const delUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) throw new Error("Missing input id");
  const result = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: result ? true : false,
    deleteUser: result
      ? `User with email: '${result.email}' deleted`
      : "No user delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: result ? true : false,
    updateUser: result ? result : "Some thing went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const result = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-refreshToken -password -role");
  return res.status(200).json({
    success: result ? true : false,
    updateUser: result ? result : "Some thing went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const result = await User.findByIdAndUpdate(
    _id,
    { address: req.body.address },
    { new: true }
  ).select("-refreshToken -password -role");
  return res.status(200).json({
    success: result ? true : false,
    updateAddress: result ? result : "Some thing went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (!alreadyProduct || alreadyProduct.color !== color) {
    const result = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity: quantity, color: color } } },
      { new: true }
    );
    return res.status(200).json({
      success: result ? true : false,
      updatedCart: result ? result : "Some thing went wrong",
    });
  } else {
    const result = await User.updateOne(
      { cart: { $elemMatch: alreadyProduct } },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    );
    return res.status(200).json({
      success: result ? true : false,
      updatedCart: result ? result : "Some thing went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  delUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
};
