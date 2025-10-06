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
    },
    price: {
      type: Number,
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    number: {
      type: Number,
      required: [true, "book number required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "CategoryBook",
    },
  },
  { timestamps: true }
);

const BookModel = mongoose.model("Book", bookSchema);

module.exports = BookModel;
