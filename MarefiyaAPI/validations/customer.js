const Joi = require("joi");
const ResponseMessage = require("../utilities/messages_utility");

const customerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    fathername: Joi.string().required(),
    grandfathername: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().allow(),
    email: Joi.string().min(4).required().email(),
    password: Joi.string()
      .min(6)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$/
      )
      .message(ResponseMessage.PASSWORD_VALIDITY)
      .required(),
    phone: Joi.object({
      code: Joi.string(),
      number: Joi.number(),
    }),
    address: Joi.object({
      city: Joi.string().allow("").default("JigJiga"),
      subCity: Joi.string().required(""),
      kebele: Joi.string().required(),
      houseNumber: Joi.string().allow("")
    }),
    status: Joi.bool(),
    roleId: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.customerValidation = customerValidation;
