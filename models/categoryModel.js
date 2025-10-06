const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user name required"],
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// ربط تلقائي مع بيانات العمرة
// userSchema.pre(/^find/, function (next) {
//   this.populate({ path: "omra", select: "name" });
//   next();
// });

const CategoryModel = mongoose.model("CategoryBook", categorySchema);

module.exports = CategoryModel;
