const asyncHandler = require("express-async-handler");

const { UploadImageCloudinary } = require("../utils/Cloudinary");

const UploadMultipleImages = asyncHandler(async (req, res, next) => {
  if (req.files?.images) {
    req.images = [];
    await Promise.all(
      req.files.images.map(async (Image) => {

        const result = await UploadImageCloudinary(Image.path);

        req.images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      })
    );
  }

next();

});

module.exports = UploadMultipleImages;
