const express = require("express");

const router = express.Router();
const {
createBook,
getBook,
getBooks,
updateBook,
deleteBook
} = require("../controllers/bookController");

const { upload } = require("../utils/MulterConfig");

const UploadMultipleImages = require("../middlewares/UploadMultipleImagesMiddleware");

router
  .route("/")
  .get(getBooks)
  .post(
    upload.fields([
      {
        name: "images",
        maxCount: 10,
      },
    ]),
    UploadMultipleImages,
    createBook
  );

router
  .route("/:id")
  .put(
    upload.fields([
      {
        name: "images",
        maxCount: 10,
      }
    ]),
    UploadMultipleImages,
    updateBook
  )
  .get(getBook)
  .delete(deleteBook);

module.exports = router;
