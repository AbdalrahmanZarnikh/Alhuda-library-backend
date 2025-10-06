const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

const CategoryModel = require("../../models/categoryModel");

const ApiError = require("../ApiError");
const { default: slugify } = require("slugify");

const getProductValidator = [
  check("id").isMongoId().withMessage("invalid Id Product"),
  validatorMiddleware,
];

const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters"),
  check("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too Long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product Price is required")
    .isNumeric()
    .withMessage("Product Price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too Long Price"),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product PriceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should br array of string"),


  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("invalid ID format")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new ApiError("Not found category"));
        }
      })
    ),

  
  check("brand").optional().isMongoId().withMessage("invalid ID format"),


  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage should be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be above or equal to 5.0"),


  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("invalid Id Product"),

  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
const deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid Id Product"),
  validatorMiddleware,
];

module.exports = {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
