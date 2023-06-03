const router = require("express").Router();
const blogController = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], blogController.createNewBlog);

router.get("/get-one/:bid", blogController.getBlog);

router.get("/get-all", blogController.getAllBlogs);

router.put(
  "/update-image/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  blogController.uploadImageBlog
);

router.put("/like/:bid", verifyAccessToken, blogController.likeBlog);

router.put("/dislike/:bid", verifyAccessToken, blogController.dislikeBlog);

router.patch(
  "/update/:bid",
  [verifyAccessToken, isAdmin],
  blogController.updateBlog
);

router.delete(
  "/delete/:bid",
  [verifyAccessToken, isAdmin],
  blogController.deleteBlog
);

module.exports = router;
