const router = require("express").Router();
const orderController = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, orderController.createOrder);

router.get("/", verifyAccessToken, orderController.getUserOrder);

router.get("/admin", [verifyAccessToken, isAdmin], orderController.getOrders);

router.put(
  "/status/:orderId",
  [verifyAccessToken, isAdmin],
  orderController.updateOrderStatus
);

module.exports = router;
