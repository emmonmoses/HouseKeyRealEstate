const Joi = require("joi");

const feeTypeValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    amount: Joi.number().required(""),
    actionBy: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.feeTypeValidation = feeTypeValidation;
