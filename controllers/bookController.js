const BookModel = require("../models/bookModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");
const {
  RemoveMultipleImagesCloudinary,
  RemoveMultipleFilesCloudinary,
} = require("../utils/Cloudinary");

// 📥 Get all books
const getBooks = asyncHandler(async (req, res) => {
  const countDocuments = await BookModel.countDocuments();

  const features = new ApiFeatures(BookModel.find({}), req.query)
    .Filter()
    .Search("BookModel")
    .Paginate(countDocuments)
    .LimitFields()
    .Sort();

  const { mongooseQuery, pagination } = features;
  const books = await mongooseQuery;

  if (!books) {
    return next(new ApiError("Books not found!", 404));
  }

  res.status(200).json({ status: "Success", pagination, data: books });
});

// 📥 Get single book
const getBook = asyncHandler(async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return next(new ApiError("Book not found!", 404));
  }
  res.status(200).json({ status: "Success", data: book });
});

// ➕ Create new book
const createBook = asyncHandler(async (req, res) => {
  if (req.images) {
    req.body.images = req.images;
  }

  const book = await BookModel.create(req.body);
  res.status(201).json({ status: "Success", data: book });
});

// ✏️ Update book
const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.files?.images) {
    await RemoveMultipleImagesCloudinary(BookModel, id);
    req.body.images = req.images;
  }

  const bookUpdated = await BookModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!bookUpdated) {
    return res.status(404).json({ status: "Fail", message: "Book Not Found" });
  }

  return res.status(200).json({ status: "Updated", data: bookUpdated });
});

// ❌ Delete user
const deleteBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const findDocument = await BookModel.findById(id);

  if (findDocument?.images) {
    await RemoveMultipleImagesCloudinary(BookModel, id);
  }

  if (findDocument?.filePdf) {
    await RemoveMultipleFilesCloudinary(User, id);
  }

  const document = await BookModel.findByIdAndDelete(id);

  if (!document) {
    return res
      .status(404)
      .json({ status: "Fail", message: "Document not found" });
  }

  res
    .status(200)
    .json({ status: "Success", message: "Document deleted successfully" });
});

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
