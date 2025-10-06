const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.UploadImageCloudinary = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path);

    return result;
  } catch (error) {
    console.log(error);
  }
};

exports.RemoveImageCloudinary = async (Model, id) => {
  try {
    const doc = await Model.findById(id);
    if (doc.image.public_id) {
      const result = await cloudinary.uploader.destroy(doc.image.public_id);
      return result;
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

exports.RemoveMultipleImagesCloudinary = async (Model, id) => {
  try {
    const doc = await Model.findById(id);
    if (doc.images) {
      doc.images.forEach(async (image) => {
        const result = await cloudinary.uploader.destroy(image.public_id);
        return result;
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.UploadFileCloudinary = async (path) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      resource_type: "raw", // يجبره يكون raw
      public_id: `pdfs/${Date.now()}`, // اسم جديد يضمن ما يتعارض مع القديم
      use_filename: false,
      unique_filename: false,
      overwrite: false,
      flags: "attachment",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ error: "فشل الرفع" });
  }
};

exports.RemoveFileCloudinary = async (Model, id) => {
  try {
    const doc = await Model.findById(id);
    if (doc.file?.public_id) {
      const result = await cloudinary.uploader.destroy(doc.file.public_id, {
        resource_type: "raw", // ضروري لحذف ملفات raw
      });
      return result;
    }
    return;
  } catch (error) {
    console.log("Delete error:", error);
  }
};

exports.RemoveMultipleFilesCloudinary = async (Model, id) => {
  try {
    const doc = await Model.findById(id);
    if (Array.isArray(doc.filePdf)) {
      for (const file of doc.filePdf) {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id, {
            resource_type: "raw", // ضروري لحذف ملفات غير الصور
          });
        }
      }
    }
  } catch (error) {
    console.log("Error removing multiple files:", error);
  }
};

exports.RemoveAllUsersImagesCloudinary = async (UserModel,omraId) => {
  try {
    const users = await UserModel.find({omra:omraId}); //  جلب جميع المستخدمين في نفس العمرة

    for (const user of users) {
      // حذف صورة واحدة إن وجدت
      if (user.image?.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
      }

      // حذف صور متعددة إن وجدت
      if (Array.isArray(user.images)) {
        for (const image of user.images) {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        }
      }
    }

    console.log("تم حذف الصور لجميع المستخدمين بنجاح");
  } catch (error) {
    console.error("خطأ أثناء حذف الصور لجميع المستخدمين:", error);
  }
};

