const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

const { default: slugify } = require("slugify");
const UserModel = require("../../models/userModel");


exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("user required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("email")
    .notEmpty()
    .withMessage("Please enter a valid email address")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) =>
      UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already exists"));
        }
      })
    )
  ,
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("password confirmation faild");
      }
      return true;
    }),
  check("confirmPassword").notEmpty().withMessage("password confirm required"),

  validatorMiddleware
];

