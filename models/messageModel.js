const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
  {
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    message: {
      type: String,
       
    },
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email _id" });
  next();
});

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;
