const { UploadImageCloudinary } = require("../utils/Cloudinary");

const UploadImage = async (req, res, next) => {
  if (req.file || req.files) {
    try {
      let result;
      if (req.files?.image) {
        result = await UploadImageCloudinary(req.files.image[0].path);
      } else {
        result = await UploadImageCloudinary(req.file.path);
      }

    

      req.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };

    } catch (error) {
      console.log(error);
    }
  }
  next();
};

module.exports = UploadImage;
