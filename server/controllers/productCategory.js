const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const category = await ProductCategory.create(req.body);
  res.status(201).json({
    success: category ? true : false,
    createCategory: category ? category : "Cannot create new product category",
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await ProductCategory.find().select("title _id");
  res.status(200).json({
    success: categories ? true : false,
    productCategories: categories
      ? categories
      : "Cannot get product categories",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const data = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  res.status(201).json({
    success: data.toObject ? true : false,
    updateCategory: data ? data : "Cannot update product category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);
  res.status(200).json({
    success: response ? true : false,
    deleteCategory: response
      ? "Delete product category successfully"
      : "Cannot delete product category",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
