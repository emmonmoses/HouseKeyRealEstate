// MODELS
const FeeType = require("../../models/feetype");

// VALIDATIONS
const { feeTypeValidation } = require("../../validations/feetype");

// UTILITIES
const Response = require("../../utilities/response_utility");
const Date_Utility = require("../../utilities/date_utility");
const ResponseMessage = require("../../utilities/messages_utility");
const PaginationUtility = require("../../utilities/pagination_utility");
const { createActivityLog } = require("../../utilities/activitylog_utility");

const moduleName = "FeeType";

module.exports = {
  create: async (req, res) => {
    try {
      const feeTypeData = req.body;

      const { error } = feeTypeValidation(feeTypeData);

      if (error) {
        return Response.errorResponse(res, 400, error);
      }

      const feetype = new FeeType({
        name: feeTypeData.name,
        description: feeTypeData.description,
        amount: feeTypeData.amount,
        createdAt: Date_Utility.currentDate(),
      });

      const newFeeType = await feetype.save();

      const action = `New ${moduleName}`;
      const person = feeTypeData.actionBy;
      await createActivityLog(moduleName, action, person);

      return Response.successResponse(res, res.statusCode, newFeeType);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getFeeTypes: async (req, res) => {
    try {
      const totalFeeTypes = await FeeType.countDocuments();
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalFeeTypes
      );

      if (pagination.page > pagination.pages) {
        return res.status(200).json({
          message: `Page number ${pagination.page} is greater than the total number of pages that is ${pagination.pages}`,
        });
      }

      pagination.data = await FeeType.find()

        .select("-updatedAt -createdAt")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize)
        .lean();

      pagination.data = pagination.data.map((feetype) => {
        feetype.id = feetype._id.toHexString();
        return feetype;
      });

      if (pagination.data.length === 0) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.NO_DATA
        );
      }

      return Response.paginationResponse(res, res.statusCode, pagination);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getFeeTypeById: async (req, res) => {
    try {
      const feeTypeId = req.params.id;

      const feetype = await FeeType.findById(feeTypeId)
        .select("-updatedAt -createdAt")
        .lean();

      if (!feetype) {
        return Response.errorResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      feetype.id = feetype._id.toHexString();

      return Response.successResponse(res, res.statusCode, feetype);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  delete: async (req, res) => {
    try {
      const bed = await FeeType.findById(req.params.id);

      if (!bed) {
        return Response.customResponse(res, 404, ResponseMessage.NO_DATA);
      }

      await bed.deleteOne();

      const action = `Deleted ${moduleName} - ${bed._id}`;
      const person = req.param.createdBy;
      await createActivityLog(moduleName, action, person);

      return Response.customResponse(
        res,
        res.statusCode,
        ResponseMessage.SUCCESS_MESSAGE
      );
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  update: async (req, res) => {
    try {
      const feetype = await FeeType.findById(req.body.id);
      console.log(feetype);

      if (!feetype) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      feetype.name = req.body.name || feetype.name;
      feetype.description = req.body.description || feetype.description;
      feetype.amount = req.body.amount || feetype.amount;
      feetype.updatedAt = Date_Utility.currentDate();
      const updatedFeeType = await feetype.save();

      const action = `Updated ${moduleName} - ${feetype._id}`;
      const person = req.body.actionBy;
      await createActivityLog(moduleName, action, person);

      return Response.successResponse(res, res.statusCode, updatedFeeType);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },
};
