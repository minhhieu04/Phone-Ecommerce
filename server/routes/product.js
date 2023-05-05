const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/create",
  [verifyAccessToken, isAdmin],
  productController.createProduct
);

router.get("/", productController.getsProduct);

router.get("/:pid", productController.getProduct);

router.put(
  "/:pid",
  [verifyAccessToken, isAdmin],
  productController.updateProduct
);
router.delete(
  "/:pid",
  [verifyAccessToken, isAdmin],
  productController.delProduct
);

module.exports = router;
