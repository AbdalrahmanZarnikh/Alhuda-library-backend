const asyncHandler = require("express-async-handler");
const BookModel = require("../models/bookModel");
const CartModel = require("../models/cartModel");
const ApiError = require("../utils/ApiError");

const calcTotalCartPrice = async (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  cart.totalCartPrice = totalPrice;
};

exports.addBookToCart = asyncHandler(async (req, res, next) => {
  const { bookId } = req.body;

  const book = await BookModel.findById(bookId);
  if (!book) return next(new Error("Book Not Found"));

  let cart = await CartModel.findOne({});
  if (!cart) {
    cart = await CartModel.create({
      cartItems: [{ book: bookId, price: book.price, quantity: 1 }],
    });
  } else {
    const bookIndex = cart.cartItems.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (bookIndex > -1) {
      cart.cartItems[bookIndex].quantity =
        (cart.cartItems[bookIndex].quantity || 1) + 1;
    } else {
      cart.cartItems.push({ book: bookId, price: book.price, quantity: 1 });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();
  await cart.populate({
    path: "cartItems.book",
    select: "title price author quantity _id",
  });

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne();

  if (!cart) {
    return next(new ApiError("لا توجد قائمة مبيعات", 404));
  }

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndDelete();

  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }

  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await CartModel.findOne({});

  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];

    if (quantity > cartItem.book.quantity) {
      return next(new ApiError("الكمية الموجودة غير كافية"));
    }

    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError("there is no item for this id ", 404));
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    {},
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError("No cart found for this user", 404));
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.confirmPaid = asyncHandler(async (req, res) => {
  const cart = await CartModel.findOne();

  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.book },
      update: { $inc: { quantity: -item.quantity } },
    },
  }));

  await BookModel.bulkWrite(bulkOption, {});

  await CartModel.findOneAndDelete();

  res.status(204).json({ status: "success" });
});
