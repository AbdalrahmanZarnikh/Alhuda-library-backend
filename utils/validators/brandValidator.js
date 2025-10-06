const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/ValidatorMiddleware");

const { default: slugify } = require("slugify");

const getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand"),
  validatorMiddleware,
];

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too Short Catrgory name")
    .isLength({ max: 32 })
    .withMessage("Too Long Brand name"),
    check("name").custom((val,{req})=>{
      req.body.slug=slugify(val)
      return true;
    }),
  
    
    validatorMiddleware
];



const updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand"),
  check("name").optional().custom((val,{req})=>{
    req.body.slug=slugify(val)
    return true;
  }),

  
  validatorMiddleware,
];
const deleteBrandValidator = [
    check("id").isMongoId().withMessage("invalid Brand"),
    validatorMiddleware,
  ];

module.exports = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
  
};
