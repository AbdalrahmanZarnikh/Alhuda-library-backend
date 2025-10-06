const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");


const ReviewModel=require("../../models/reviewModel")
const { default: slugify } = require("slugify");

const getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review"),
  validatorMiddleware,
];

const createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratings value must be between 1 and 5")
    ,


    check("product").isMongoId().withMessage("invalid product id").custom((val,{req})=>{
      return ReviewModel.findOne({user:req.user._id,product:req.body.product}).then((review)=>{
        if(review){
          return Promise.reject(new Error("you already have a review before"))
        }
      })
    }),

  validatorMiddleware,
];

const updateReviewValidator = [
  check("id").isMongoId().withMessage("invalid review Id").custom((val,{req})=>{
     return ReviewModel.findById(val).then((review)=>{
      if(!review){
        return Promise.reject(new Error("there is no review with id"))
      }
      if(review.user._id.toString()!==req.user._id.toString()){
        return Promise.reject(new Error("you are not allowed to update this review"))
      }
     })
  }),
  validatorMiddleware];


const deleteReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review").custom((val,{req})=>{
    if(req.user.role==="user"){
      return ReviewModel.findById(val).then((review)=>{
        if(review.user._id.toString()!==req.user._id.toString()){
          return Promise.reject(new Error("you are not allowed to delete this review"))
        }
      })
    }
    return true;
  }),
  validatorMiddleware,
];

module.exports = {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
