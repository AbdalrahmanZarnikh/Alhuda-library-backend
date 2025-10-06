
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures=require("../utils/ApiFeatures");

const MessageModel = require("../models/messageModel");

exports.GetAllMessages = asyncHandler(async (req, res, next) => {

  const countDocuments=await MessageModel.countDocuments();

  const features=new ApiFeatures(MessageModel.find({}),req.query)

  features.Paginate(countDocuments).Filter().Search("MessageModel").LimitFields().Sort()

  const {mongooseQuery,pagination}=features

  const messages=await mongooseQuery;

  if (!messages) {
    return next(new ApiError("messages Not Found !!", 404));
  }

  res.status(200).json({ status: "Success",pagination, data: messages });
});




exports.CreateMessage=asyncHandler(async(req,res,next)=>{
  const message=await MessageModel.create({
    user:req.user,
    message:req.body.message
  });
  res.status(201).json({status:"Success",data:message});
})




exports.DeleteMessage=asyncHandler(async (req,res)=>{
  const {id} =req.params



  const document=await MessageModel.findByIdAndDelete(id);
   
     if (!document) {
      return res
        .status(404)
        .json({ status: "Fail", message: "Document not found" });
    }
    res
      .status(200)
      .json({ status: "Success", message: "Document deleted successfully" });
})