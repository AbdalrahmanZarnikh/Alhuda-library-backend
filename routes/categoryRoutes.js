const express = require("express");

const router = express.Router();
const {
  CreateCategory,
  GetAllCategories,
  GetOneCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../controllers/categoryController");
const UploadMultipleImages = require("../middlewares/UploadMultipleImagesMiddleware");
const { upload } = require("../utils/MulterConfig");

router
  .route("/")
  .get(GetAllCategories)
  .post(
    upload.fields([
      {
        name: "images",
        maxCount: 10,
      },
    ]),
    UploadMultipleImages,
    CreateCategory
  );

router
  .route("/:id")
  .put(
    upload.fields([
      {
        name: "images",
        maxCount: 10,
      },
    ]),
    UploadMultipleImages,
    UpdateCategory
  )
  .get(GetOneCategory)
  .delete(DeleteCategory);

module.exports = router;
