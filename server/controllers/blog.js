const { response } = require("express");
const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category)
    throw new Error("Missing inputs for create");
  const data = await Blog.create(req.body);
  res.status(201).json({
    success: data ? true : false,
    createdBlog: data ? data : "Cannot create new blog",
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({
    success: blogs ? true : false,
    blogs: blogs ? blogs : "Cannot get blog categories",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const data = await Blog.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  res.status(201).json({
    success: data ? true : false,
    updatedBlog: data ? data : "Cannot update blog",
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Blog.findOneAndDelete(bid);
  res.status(200).json({
    success: response ? true : false,
    deleteBlog: response ? "Delete blog  successfully" : "Cannot delete blog",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.body;
  if (!bid) throw new Error("Missing or invalid bid");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find(
    (userDisliked) => userDisliked.toString() === _id
  );
  if (alreadyDisliked) {
    const updatedDislikeStatus = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(201).json({
      success: updatedDislikeStatus ? true : false,
      result: updatedDislikeStatus,
    });
  }

  const alreadyLiked = blog?.likes?.find(
    (userLiked) => userLiked.toString() === _id
  );
  if (alreadyLiked) {
    const updatedLikeStatus = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(201).json({
      success: updatedLikeStatus ? true : false,
      result: updatedLikeStatus,
    });
  } else {
    const updatedLikeStatus = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(201).json({
      success: updatedLikeStatus ? true : false,
      result: updatedLikeStatus,
    });
  }
});

module.exports = {
  createNewBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  likeBlog,
};
