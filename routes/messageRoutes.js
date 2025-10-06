const express = require("express");

const router = express.Router();
const { Allowed, Protect } = require("../controllers/authController");
const {
CreateMessage,
DeleteMessage,
GetAllMessages
} = require("../controllers/messageController");




router
  .route("/")
  .get(Protect,Allowed("admin"),GetAllMessages)
  .post(
    Protect,
    CreateMessage
  );

router
  .route("/:id")
  .delete(Protect, Allowed("admin"), DeleteMessage);

module.exports = router;
