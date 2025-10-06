const { UploadFileCloudinary } = require("../utils/Cloudinary");

const UploadFile = async (req, res, next) => {
  if (req.file || req.files) {
    try {
      let result;
      if (req.files?.file) {
        result = await UploadFileCloudinary(req.files.file[0].path);
      } else {
        result = await UploadFileCloudinary(req.file.path);
      }

      req.fileCloudinary = {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type,
      };

    } catch (error) {
      console.log("Upload error:", error);
    }
  }
  next();
};

module.exports = UploadFile;
