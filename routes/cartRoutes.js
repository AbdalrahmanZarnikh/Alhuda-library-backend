const express = require("express");

const router = express.Router();

const {
  addBookToCart,
  getCart,
  clearCart,
  updateCartItemQuantity,
  removeCartItem,
  confirmPaid,
} = require("../controllers/cartController");

router.route("/confirm").put(confirmPaid);

router.route("/").get(getCart).post(addBookToCart).delete(clearCart);

router.route("/:itemId").delete(removeCartItem).put(updateCartItemQuantity);

module.exports = router;
