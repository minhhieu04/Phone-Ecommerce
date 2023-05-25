const router = require("express").Router();
const blogCategoryController = require("../controllers/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  blogCategoryController.createCategory
);

router.get("/get-all", blogCategoryController.getAllCategories);

router.put(
  "/update/:pcid",
  [verifyAccessToken, isAdmin],
  blogCategoryController.updateCategory
);

router.delete(
  "/delete/:pcid",
  [verifyAccessToken, isAdmin],
  blogCategoryController.deleteCategory
);

module.exports = router;
