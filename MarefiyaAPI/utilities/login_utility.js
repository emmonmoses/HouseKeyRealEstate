const Role = require("../models/role");
const { sign } = require("jsonwebtoken");
const { compareSync } = require("bcryptjs");

const DateUtil = require("../utilities/date_utility");
const Response = require("../utilities/response_utility");
const ResponseMessage = require("./messages_utility");
const { loginValidation } = require("../validations/login");
const { createActivityLog } = require("../utilities/activitylog_utility");
const moduleName = `SignIn`;
const loginStatus = 1;

const login = async (req, res, model) => {
  const body = req.body;
  const { error } = loginValidation(body);

  if (error) {
    return Response.sendValidationErrorMessage(res, 400, error);
  }

  const user = await model.findOne({ email: body.username });

  if (!user) {
    return Response.customResponse(res, 400, ResponseMessage.INVALID_USERNAME);
  }

  if (!user.status) {
    return Response.customResponse(res, 400, ResponseMessage.UNAUTHORIZED_USER);
  }

  const validPassword = compareSync(body.password, user.password);

  if (!validPassword) {
    return Response.customResponse(res, 400, ResponseMessage.INVALID_PASSWORD);
  }

  user.password = undefined;

  const jsontoken = sign({ key: user }, process.env.JWK_SECRET, {
    expiresIn: process.env.JWK_EXPIRATION,
  });

  // GET THE USER ROLE AND ASSOCIATED PERMISSIONS
  const role = await Role.findById({ _id: user.roleId });
  const claims = role.claims;

  if (!role) {
    return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
  }

  const action = `Account ${moduleName} For - ${user.code}`;
  const person = user._id;

  await createActivityLog(moduleName, action, person);

  if (user.code.startsWith("AD")) {
    // ADMIN
    return res.status(res.statusCode).json({
      loginStatus: loginStatus,
      id: user._id,
      name: user.name,
      admin: user.code,
      avatar: user.avatar,
      username: user.email,
      role: role.name,
      permissions: claims,
      authorization: {
        validFor: process.env.JWK_EXPIRATION,
        validFrom: DateUtil.validFromDate(),
        validUpto: DateUtil.expirationDate(),
        token: jsontoken,
      },
    });
  } else if (user.code.startsWith("DR")) {
    // DRIVER
    return res.status(res.statusCode).json({
      loginStatus: loginStatus,
      id: user._id,
      name: user.name,
      driver: user.code,
      avatar: user.avatar,
      username: user.email,
      role: role.name,
      permissions: claims,
      authorization: {
        validFor: process.env.JWK_EXPIRATION,
        validFrom: DateUtil.validFromDate(),
        validUpto: DateUtil.expirationDate(),
        token: jsontoken,
      },
    });
  } else {
    // CUSTOMER or PARENT
    return res.status(res.statusCode).json({
      loginStatus: loginStatus,
      id: user._id,
      name: user.name,
      customer: user.code,
      username: user.email,
      role: role.name,
      permissions: claims,
      authorization: {
        validFor: process.env.JWK_EXPIRATION,
        validFrom: DateUtil.validFromDate(),
        validUpto: DateUtil.expirationDate(),
        token: jsontoken,
      },
    });
  }
};

module.exports = { login };
