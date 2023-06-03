const router = require("express").Router();
const couponController = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], couponController.createCoupon);

router.get("/get-one/:cid", couponController.getCoupon);

router.get("/get-all", couponController.getAllCoupons);

router.patch(
  "/update/:cid",
  [verifyAccessToken, isAdmin],
  couponController.updateCoupon
);

router.delete(
  "/delete/:cid",
  [verifyAccessToken, isAdmin],
  couponController.deleteCoupon
);

module.exports = router;
