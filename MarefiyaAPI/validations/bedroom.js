const Joi = require("joi");

const bedRoomValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required(),
    actionBy: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.bedRoomValidation = bedRoomValidation;
