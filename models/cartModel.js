const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        book: {
          type: mongoose.Schema.ObjectId,
          ref: "Book",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalCartPrice: Number,
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.book",
    select: "title price _id quantity author",
  });
  next();
});
cartSchema.pre(/^create/, function (next) {
  this.populate({
    path: "cartItems.book",
    select: "title price _id quantity author",
  });
  next();
});

const CartModel = mongoose.model("CartBooks", cartSchema);

module.exports = CartModel;
