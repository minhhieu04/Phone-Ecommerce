const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.create(req.body);
  res.status(201).json({
    success: category ? true : false,
    createCategory: category ? category : "Cannot create new blog category",
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.find().select("title _id");
  res.status(200).json({
    success: categories ? true : false,
    blogCategories: categories ? categories : "Cannot get blog categories",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const data = await BlogCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  res.status(201).json({
    success: data.toObject ? true : false,
    updateCategory: data ? data : "Cannot update blog category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await BlogCategory.findOneAndDelete(pcid);
  res.status(200).json({
    success: response ? true : false,
    deleteCategory: response
      ? "Delete blog category successfully"
      : "Cannot delete blog category",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
