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

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate({ path: "likes", select: "firstName lastName" })
    .populate({ path: "dislikes", select: "firstName lastName" })
    .exec();
  return res.status(200).json({
    success: blog ? true : false,
    blog: blog,
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
  const response = await Blog.findByIdAndDelete(bid);
  res.status(200).json({
    success: response ? true : false,
    deleteBlog: response ? "Delete blog successfully" : "Cannot delete blog",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
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
    const pushUidInLikesArr = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(201).json({
      success: pushUidInLikesArr ? true : false,
      result: pushUidInLikesArr,
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

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  const blog = await Blog.findById(bid);
  const alreadyLiked = blog?.likes?.find(
    (userLiked) => userLiked.toString() === _id
  );
  if (alreadyLiked) {
    const updatedLikeStatus = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    const pushUidInDislikesArr = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(201).json({
      success: pushUidInDislikesArr ? true : false,
      result: pushUidInDislikesArr,
    });
  }

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
  } else {
    const updatedDislikeStatus = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(201).json({
      success: updatedDislikeStatus ? true : false,
      result: updatedDislikeStatus,
    });
  }
});

module.exports = {
  createNewBlog,
  getBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
