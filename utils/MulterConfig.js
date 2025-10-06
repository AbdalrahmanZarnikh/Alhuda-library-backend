const multer = require("multer");
const ApiError = require("./ApiError");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `${file.fieldname}-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images and PDF files are allowed", 400), false);
  }
};

exports.upload = multer({ storage, fileFilter });
