const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

const { default: slugify } = require("slugify");



const getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category"),
  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too Short Catrgory name")
    .isLength({ max: 32 })
    .withMessage("Too Long Category name"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category"),

  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category"),
  validatorMiddleware,
];

module.exports = {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
