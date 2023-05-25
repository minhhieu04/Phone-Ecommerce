const router = require("express").Router();
const productCategoryController = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const product = require("../models/product");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  productCategoryController.createCategory
);

router.get("/get-all", productCategoryController.getAllCategories);

router.put(
  "/update/:pcid",
  [verifyAccessToken, isAdmin],
  productCategoryController.updateCategory
);

router.delete(
  "/delete/:pcid",
  [verifyAccessToken, isAdmin],
  productCategoryController.deleteCategory
);

module.exports = router;
