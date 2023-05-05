const router = require("express").Router();
const userController = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/get-profile", verifyAccessToken, userController.getCurrentUser);
router.post("/refreshtoken", userController.refreshToken);
router.get("/logout", verifyAccessToken, userController.logout);
router.get("/forgot-password", userController.forgotPassword);
router.put("/reset-password", userController.resetPassword);
router.get("/get-all", [verifyAccessToken, isAdmin], userController.getUsers);
router.delete(
  "/delete/:_id",
  [verifyAccessToken, isAdmin],
  userController.delUser
);
router.put("/update-current", verifyAccessToken, userController.updateUser);
router.put(
  "/update-user/:uid",
  [verifyAccessToken, isAdmin],
  userController.updateUserByAdmin
);

module.exports = router;
