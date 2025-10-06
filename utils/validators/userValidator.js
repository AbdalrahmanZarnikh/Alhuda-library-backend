const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

const UserModel = require("../../models/userModel");

const { default: slugify } = require("slugify");

const getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id "),
  validatorMiddleware,
];

const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("user required")
    .isLength({ min: 3 })
    .withMessage("too short user name"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .notEmpty()
    .withMessage("please enter a valid email address")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),

  validatorMiddleware,
];

const updateUserFromAdmin = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),
  check("role").optional(),

  validatorMiddleware,
];

const updateUserProfileValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("please enter a valid email address")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),

  validatorMiddleware,
];

const deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  validatorMiddleware,
];

module.exports = {
  getUserValidator,
  createUserValidator,
  updateUserFromAdmin,
  updateUserProfileValidator,
  deleteUserValidator,
};
