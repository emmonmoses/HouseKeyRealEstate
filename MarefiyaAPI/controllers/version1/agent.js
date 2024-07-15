// MODELS
const Role = require("../../models/role");
const Agent = require("../../models/agent");

// VALIDATIONS
const { agentValidation } = require("../../validations/agent");

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

const moduleName = `Agent`;

module.exports = {
  create: async (req, res) => {
    try {
      const body = req.body;
      const { error } = agentValidation(body);

      if (error) {
        return Response.sendValidationErrorMessage(res, 400, error);
      }

      const existingAgent = await Agent.findOne({
        email: body.username,
        name: body.name,
      });

      if (existingAgent) {
        return Response.customResponse(res, 409, ResponseMessage.DATA_EXISTS);
      }

      const role = await Role.findById(body.roleId);

      if (!role) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const uniqueCode = unique.randomCode();
      const hashedPassword = unique.passwordHash(body.password);

      const agent = new Agent({
        code: "AG" + uniqueCode,
        name: body.name,
        email: body.username,
        roleId: body.roleId,
        status: body.status,
        password: hashedPassword,
        createdAt: DateUtil.currentDate(),
      });

      const newAgent = await agent.save();

      const action = `New ${moduleName} - ${"AG" + uniqueCode}`;
      const person = body.actionBy;

      await createActivityLog(moduleName, action, person);

      return res.status(res.statusCode).json(newAgent);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getAgents: async (req, res) => {
    try {
      const totalAgents = await Agent.countDocuments();
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalAgents
      );

      if (pagination.page > pagination.pages) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.OUTOF_DATA
        );
      }

      pagination.data = await Agent.find()
        .populate({ path: "role", select: "name claims" })
        .select("-updatedAt -createdAt -password")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize);

      if (totalAgents === 0) {
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

  getAgentsByRole: async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);

      if (!role) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const roleId = role._id;
      const totalAgents = await Agent.countDocuments({ roleId: roleId });
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalAgents
      );

      if (pagination.page > pagination.pages) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.OUTOF_DATA
        );
      }

      pagination.data = await Agent.find({ roleId: roleId })
        .populate({ path: "role", select: "name claims" })
        .select("-updatedAt -createdAt -password")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize);

      if (totalAgents === 0) {
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
      const agent = await Agent.findById(req.params.id)
        .select("-updatedAt -createdAt -password")
        .populate([
          {
            path: "role",
            select: "name claims",
          },
        ]);

      if (!agent) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const agentData = {
        id: agent._id,
        code: agent.code,
        name: agent.name,
        email: agent.email,
        status: agent.status,
        createdAt: agent.createdAt,
        role: agent.role ? agent.role.name : null,
        permissions: agent.role ? agent.role.claims : null,
      };

      return Response.successResponse(res, res.statusCode, agentData);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  update: async (req, res) => {
    try {
      const body = req.body;
      const agent = await Agent.findById(body.id);

      if (!agent) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      agent.name = body.name || agent.name;
      agent.roleId = body.roleId || agent.roleId;
      agent.status = body.status;
      agent.actionBy = body.adminId || agent.actionBy;
      agent.email = body.username || agent.email;
      agent.updatedAt = DateUtil.currentDate();

      const updatedAgent = await agent.save();

      const action = `Updated ${moduleName} - ${agent.code}`;
      const person = body.actionBy;

      await createActivityLog(moduleName, action, person);

      return res.status(res.statusCode).json(updatedAgent);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  delete: async (req, res) => {
    try {
      const param = req.params;
      const adminId = param.createdBy;

      const agent = await Agent.findById(param.id);

      if (!agent) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      await agent.deleteOne();

      const action = `Deleted ${moduleName} - ${agent.code}`;
      await createActivityLog(moduleName, action, adminId);

      return res.status(res.statusCode).json({
        message: ResponseMessage.SUCCESS_MESSAGE,
      });
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  changePassword: async (req, res) => {
    await changePassword(req, res, Agent, moduleName);
  },

  resetPassword: async (req, res) => {
    await resetPassword(req, res, Agent, moduleName);
  },

  login: async (req, res) => {
    await login(req, res, Agent);
  },
};
