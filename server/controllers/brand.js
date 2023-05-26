const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const category = await Brand.create(req.body);
  res.status(201).json({
    success: category ? true : false,
    createBrand: category ? category : "Cannot create new brand",
  });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const categories = await Brand.find().select("title _id");
  res.status(200).json({
    success: categories ? true : false,
    brands: categories ? categories : "Cannot get brands",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const data = await Brand.findByIdAndUpdate(brandId, req.body, {
    new: true,
  });
  res.status(201).json({
    success: data.toObject ? true : false,
    updateBrand: data ? data : "Cannot update brand",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const response = await Brand.findByIdAndDelete(brandId);
  res.status(200).json({
    success: response ? true : false,
    deleteBrand: response ? "Delete brand successfully" : "Cannot delete brand",
  });
});

module.exports = {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
};
