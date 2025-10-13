const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "book title  required"],
    },
    author: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    number: {
      type: String,
      required: [true, "book number required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "CategoryBook",
    },
  },
  { timestamps: true }
);

bookSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

const BookModel = mongoose.model("Book", bookSchema);

module.exports = BookModel;
