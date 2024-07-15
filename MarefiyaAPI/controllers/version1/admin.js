// MODELS
const Role = require("../../models/role");
const Administrator = require("../../models/admin");

// VALIDATIONS
const { adminValidation } = require("../../validations/admin");

// UTILITIES
const DateUtil = require("../../utilities/date_utility");
const { login } = require("../../utilities/login_utility");
const Response = require("../../utilities/response_utility");
const unique = require("../../utilities/codegenerator_utility");
const ResponseMessage = require("../../utilities/messages_utility");
const PaginationUtility = require("../../utilities/pagination_utility");
const { resetPassword } = require("../../utilities/resetpassword_utility");
const { changePassword } = require("../../utilities/changepassword_utility");
const { createActivityLog } = require("../../utilities/activitylog_utility");

const moduleName = `Administrator`;

module.exports = {
  create: async (req, res) => {
    try {
      const body = req.body;
      const { error } = adminValidation(body);

      if (error) {
        return Response.sendValidationErrorMessage(res, 400, error);
      }

      const existingUser = await Administrator.findOne({
        email: body.username,
        name: body.name,
      });

      if (existingUser) {
        return Response.customResponse(res, 409, ResponseMessage.DATA_EXISTS);
      }

      const role = await Role.findById(body.roleId);

      if (!role) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const uniqueCode = unique.randomCode();
      const hashedPassword = unique.passwordHash(body.password);

      const admin = new Administrator({
        code: "AD" + uniqueCode,
        name: body.name,
        email: body.username,
        roleId: body.roleId,
        status: body.status,
        password: hashedPassword,
        createdAt: DateUtil.currentDate(),
      });

      const newUser = await admin.save();

      const action = `New ${moduleName} - ${"AD" + uniqueCode}`;
      const person = body.actionBy;

      await createActivityLog(moduleName, action, person);

      return res.status(res.statusCode).json(newUser);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getAdmins: async (req, res) => {
    try {
      const totalAdmins = await Administrator.countDocuments();
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalAdmins
      );

      if (pagination.page > pagination.pages) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.OUTOF_DATA
        );
      }

      pagination.data = await Administrator.find()
        .populate({ path: "role", select: "name claims" })
        .select("-updatedAt -createdAt -password")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize);

      if (totalAdmins === 0) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.NO_DATA
        );
      }

      pagination.data = pagination.data.map((item) => ({
        ...item.toJSON(),
        role: item.role ? item.role.name : null,
        permissions: item.role ? item.role.claims : null,
      }));

      return Response.paginationResponse(res, res.statusCode, pagination);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getAdminsByRole: async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);

      if (!role) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const roleId = role._id;
      const totalAdmins = await Administrator.countDocuments({ roleId: roleId });
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalAdmins
      );

      if (pagination.page > pagination.pages) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.OUTOF_DATA
        );
      }

      pagination.data = await Administrator.find({ roleId: roleId })
        .populate({ path: "role", select: "name claims" })
        .select("-updatedAt -createdAt -password")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize);

      if (totalAdmins === 0) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.NO_DATA
        );
      }

      pagination.data = pagination.data.map((item) => ({
        ...item.toJSON(),
        role: item.role ? item.role.name : null,
        permissions: item.role ? item.role.claims : null,
      }));

      return Response.paginationResponse(res, res.statusCode, pagination);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  get: async (req, res) => {
    try {
      const admin = await Administrator.findById(req.params.id)
        .select("-updatedAt -createdAt -password")
        .populate([
          {
            path: "role",
            select: "name claims",
          },
        ]);

      if (!admin) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const adminData = {
        id: admin._id,
        code: admin.code,
        name: admin.name,
        email: admin.email,
        status: admin.status,
        createdAt: admin.createdAt,
        role: admin.role ? admin.role.name : null,
        permissions: admin.role ? admin.role.claims : null,
      };

      return Response.successResponse(res, res.statusCode, adminData);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  update: async (req, res) => {
    try {
      const body = req.body;
      const admin = await Administrator.findById(body.id);

      if (!admin) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      admin.name = body.name || admin.name;
      admin.roleId = body.roleId || admin.roleId;
      admin.status = body.status;
      admin.actionBy = body.adminId || admin.actionBy;
      admin.email = body.username || admin.email;
      admin.updatedAt = DateUtil.currentDate();

      const updatedAdmin = await admin.save();

      const action = `Updated ${moduleName} - ${admin.code}`;
      const person = body.actionBy;

      await createActivityLog(moduleName, action, person);

      return res.status(res.statusCode).json(updatedAdmin);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  delete: async (req, res) => {
    try {
      const param = req.params;
      const adminId = param.createdBy;

      const admin = await Administrator.findById(param.id);

      if (!admin) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      await admin.deleteOne();

      const action = `Deleted ${moduleName} - ${admin.code}`;
      await createActivityLog(moduleName, action, adminId);

      return res.status(res.statusCode).json({
        message: ResponseMessage.SUCCESS_MESSAGE,
      });
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  changePassword: async (req, res) => {
    await changePassword(req, res, Administrator, moduleName);
  },

  resetPassword: async (req, res) => {
    await resetPassword(req, res, Administrator, moduleName);
  },

  login: async (req, res) => {
    await login(req, res, Administrator);
  },
};
