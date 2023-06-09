const { response } = require("express");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);
  return res.status(201).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot find product",
  });
});

//Filtering, sorting and pagination
// Code tham khảo: https://jeffdevslife.com/p/1-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedElement) => `$${matchedElement}`
  );
  const formatQueries = JSON.parse(queryString);

  // Filtering
  if (queries?.title)
    formatQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatQueries);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Execute the query
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formatQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        products: response ? response : "Cannot find products",
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
  // queryCommand.exec(async (err, response) => {
  //   if (err) throw new Error(err.message);
  //   return res.status(200).json({
  //     success: response ? true : false,
  //     products: response ? response : "Cannot find products",
  //     counts,
  //   });
  // });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updatedProduct: updateProduct ? updateProduct : "Cannot update product",
  });
});

const delProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    message: deletedProduct ? "Delete Successfully" : "Cannot find product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !comment || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  // Check có được đánh giá hay không
  const alreadyRating = ratingProduct?.ratings.find(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    // Update rating
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true }
    );
  } else {
    // Add rating
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  // Sum rating
  const updateProduct = await Product.findById(pid);
  const countRatings = updateProduct.ratings.length;
  const sumRatings = updateProduct.ratings.reduce(
    (sum, rating) => (sum += rating.star),
    0
  );
  updateProduct.totalRatings = (sumRatings / countRatings).toFixed(1);
  await updateProduct.save();

  return res.status(200).json({
    status: true,
  });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing files");
  const imageUrls = req.files.map((file) => file.path);
  console.log(imageUrls);
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: imageUrls } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedProduct: response ? response : "Cannot update product",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  delProduct,
  ratings,
  uploadImagesProduct,
};
