const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        count: Number,
        color: String,
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: ["Cancelled", "Processing", "Succeeded"],
    },
    total: Number,
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
