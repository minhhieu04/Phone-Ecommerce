const router = require("express").Router();
const insertDataController = require("../controllers/insertData");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/product", insertDataController.insertProduct);
router.post("/cate", insertDataController.insertCategory);

module.exports = router;
