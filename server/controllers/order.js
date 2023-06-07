const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");
  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    quantity: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );
  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
        1000 || total;
    createData.total = total;
    createData.coupon = coupon;
  }
  const result = await Order.create(createData);
  res.status(201).json({
    success: result ? true : false,
    result: result ? result : "Something went wrong",
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const status = req.body.status;
  if (!status) throw new Error("Missing status");
  const result = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  res.status(201).json({
    success: result ? true : false,
    result: result ? result : "Something went wrong",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const result = await Order.find({ orderBy: _id });

  res.status(201).json({
    success: result ? true : false,
    result: result ? result : "Something went wrong",
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const result = await Order.find();
  res.status(201).json({
    success: result ? true : false,
    result: result ? result : "Something went wrong",
  });
});

module.exports = {
  createOrder,
  updateOrderStatus,
  getUserOrder,
  getOrders,
};
