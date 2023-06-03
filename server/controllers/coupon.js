const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry)
    throw new Error("Missing inputs for create");
  const data = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    success: data ? true : false,
    createdCoupon: data ? data : "Cannot create new coupon",
  });
});

const getCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const coupon = await Coupon.findById(cid);
  return res.status(200).json({
    success: coupon ? true : false,
    coupon: coupon ? coupon : "Cannot find coupon",
  });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().select("-createAt -updatedAt");
  res.status(200).json({
    success: coupons ? true : false,
    coupons: coupons ? coupons : "Cannot get coupons",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const { expiry } = req.body;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000;
  const data = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  res.status(201).json({
    success: data ? true : false,
    updatedBlog: data ? data : "Cannot update coupon",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  res.status(200).json({
    success: response ? true : false,
    deleteCoupon: response
      ? "Delete coupon successfully"
      : "Cannot delete coupon",
  });
});
module.exports = {
  createCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
