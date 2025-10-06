const mongoose = require("mongoose");

const ConnectDB = () => {
  const url = process.env.MONGO_URL;
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log("error", err));
};

module.exports=ConnectDB;
