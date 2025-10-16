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
  const filter = {};
  if (req.query.category && req.query.category !== "الكل") {
    filter.category = req.query.category;
  }

  const booksQuery = BookModel.find(filter);
  const count = await BookModel.countDocuments(filter);

  const apiFeatures = new ApiFeatures(booksQuery, req.query)
    .Filter()
    .Paginate(count)
    .Search("BookModel");

  const books = await apiFeatures.mongooseQuery;

  res.status(200).json({
    status: "Success",
    pagination: apiFeatures.pagination,
    data: books,
  });
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

  const existBook = await BookModel.findOne({
    title: req.body.title,
    category: req.body.category,
  });

  if (existBook) {
    existBook.quantity += +req.body.quantity;
    if (req.body.price) {
      existBook.price = +req.body.price;
    }
    if (req.body.number) {
      const newStr = existBook.number
        ? existBook.number + "," + req.body.number
        : req.body.number;

      const numberWithoutRepetition = [...new Set(newStr.split(","))].join();

      existBook.number = numberWithoutRepetition;
    }

    await existBook.save();

    res.status(201).json({ status: "Success", data: existBook });
  } else {
    // تأكد من وجود number عند الإنشاء
    if (!req.body.number) req.body.number = "";
    else {
      const numberWithoutRepetition = [
        ...new Set(req.body.number.split(",")),
      ].join();

      req.body.number = numberWithoutRepetition;
    }
    const book = await BookModel.create(req.body);
    res.status(201).json({ status: "Success", data: book });
  }
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

  if (bookUpdated.quantity == 0) {
    await BookModel.findByIdAndDelete(bookUpdated._id);
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
