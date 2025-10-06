const { UploadFileCloudinary } = require("../utils/Cloudinary");

const UploadFiles = async (req, res, next) => {
  
  if (req.files?.filePdf) {
    try {
      const uploadedFiles = [];

      for (const file of req.files.filePdf) {
        const result = await UploadFileCloudinary(file.path);
        uploadedFiles.push({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
        });


      }

      

      req.uploadedFiles = uploadedFiles;
    } catch (error) {
      console.log("File upload error:", error);
    }
  }
  next();
};

module.exports = UploadFiles;
