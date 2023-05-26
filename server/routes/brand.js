const router = require("express").Router();
const brandController = require("../controllers/brand");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], brandController.createBrand);

router.get("/get-all", brandController.getAllBrands);

router.put(
  "/update/:brandId",
  [verifyAccessToken, isAdmin],
  brandController.updateBrand
);

router.delete(
  "/delete/:brandId",
  [verifyAccessToken, isAdmin],
  brandController.deleteBrand
);

module.exports = router;
