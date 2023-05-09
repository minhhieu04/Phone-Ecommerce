const router = require("express").Router();
const productController = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/create",
  [verifyAccessToken, isAdmin],
  productController.createProduct
);
// [GET] product/?<fieldName>[gt || gte || lte || lt ]?sort
router.get("/", productController.getProducts);
router.put("/ratings", verifyAccessToken, productController.ratings);

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
