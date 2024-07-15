// MODELS
const Subscription = require("../../models/subscription");

// VALIDATIONS
const { subscriptionValidation } = require("../../validations/subscription");

// UTILITIES
const DateUtil = require("../../utilities/date_utility");
const Response = require("../../utilities/response_utility");
const unique = require("../../utilities/codegenerator_utility");
const ResponseMessage = require("../../utilities/messages_utility");
const PaginationUtility = require("../../utilities/pagination_utility");
const { createActivityLog } = require("../../utilities/activitylog_utility");

const moduleName = `Subscription`;

module.exports = {
  create: async (req, res) => {
    try {
      const body = req.body;
      const { error } = subscriptionValidation(body);

      if (error) {
        return Response.sendValidationErrorMessage(res, 400, error);
      }

      const existingSubscription = await Subscription.findOne({
        customer: body.customer,
        bedRoomId: body.bedRoomId,
      });

      if (existingSubscription) {
        return Response.customResponse(res, 409, ResponseMessage.DATA_EXISTS);
      }

      const uniqueCode = unique.randomCode();

      const subscription = new Subscription({
        code: "SN" + uniqueCode,
        propertyType: body.propertyType,
        location: body.location,
        customerId: body.customerId,
        bedRoomId: body.bedRoomId,
        adminId: body.adminId,
        feeTypes: body.feeTypes.map((ftp) => ({
          id: ftp.id,
        })),
        description: body.description,
        status: body.status,
        createdAt: DateUtil.currentDate(),
      });

      const newSubscription = await subscription.save();

      const action = `New ${moduleName} - ${"SN" + uniqueCode}`;
      const person = body.actionBy;

      await createActivityLog(moduleName, action, person);

      return res.status(res.statusCode).json(newSubscription);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getSubscriptions: async (req, res) => {
    try {
      const totalSubscriptions = await Subscription.countDocuments();
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalSubscriptions
      );

      if (pagination.page > pagination.pages) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.OUTOF_DATA
        );
      }

      const subscriptions = await Subscription.find()
        .select("-customers.password -creator.password")
        .populate([
          {
            path: "customer",
            select: "id firstname fathername grandfathername",
          },
          { path: "bedRooms", select: "id name" },
          { path: "creator", select: "id name code" },
          { path: "feeTypeDetails", select: "id name amount" },
        ])
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize);

      if (totalSubscriptions === 0) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.NO_DATA
        );
      }

      const data = subscriptions.map((item) => {
        const jsonData = item.toJSON();
        const feeTypesMap = new Map();

        if (item.feeTypeDetails) {
          item.feeTypeDetails.forEach((ftp) => {
            feeTypesMap.set(ftp._id.toString(), {
              id: ftp._id,
              name: ftp.name,
              amount: ftp.amount,
            });
          });
        }

        delete jsonData.feeTypeDetails;

        return {
          ...jsonData,
          feeTypes: Array.from(feeTypesMap.values()),
          customer: item.customer ? item.customer : null,
          bedRooms: item.bedRooms ? item.bedRooms : null,
          creator: item.creator ? item.creator : null,
        };
      });

      pagination.data = data;

      return Response.paginationResponse(res, res.statusCode, pagination);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getSubscriptionByCustomer: async (req, res) => {
    try {
      const subscription = await Subscription.findOne({
        customerId: req.params.customerId,
      });

      if (!subscription) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const customerId = subscription.customerId;
      const totalSubscriptions = await Subscription.countDocuments({
        customerId: customerId,
      });
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalSubscriptions
      );

      if (pagination.page > pagination.pages) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.OUTOF_DATA
        );
      }

      pagination.data = await Subscription.find({ customerId: customerId })
        .select("-customers.password -creator.password")
        .populate([
          {
            path: "customer",
            select: "id firstname fathername grandfathername",
          },
          { path: "bedRooms", select: "id name" },
          { path: "creator", select: "id name code" },
          { path: "feeTypeDetails", select: "id name amount" },
        ])
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize);

      if (totalSubscriptions === 0) {
        return Response.customResponse(
          res,
          res.statusCode,
          ResponseMessage.NO_DATA
        );
      }

      pagination.data = pagination.data.map((item) => {
        const jsonData = item.toJSON();
        const feeTypesMap = new Map();

        if (item.feeTypeDetails) {
          item.feeTypeDetails.forEach((ftp) => {
            feeTypesMap.set(ftp._id.toString(), {
              id: ftp._id,
              name: ftp.name,
              amount: ftp.amount,
            });
          });
        }

        delete jsonData.feeTypeDetails;

        return {
          ...jsonData,
          feeTypes: Array.from(feeTypesMap.values()),
          customer: item.customer ? item.customer : null,
          bedRooms: item.bedRooms ? item.bedRooms : null,
          creator: item.creator ? item.creator : null,
        };
      });

      return Response.paginationResponse(res, res.statusCode, pagination);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  get: async (req, res) => {
    try {
      const subscription = await Subscription.findById(req.params.id)
        .select("-customers.password -creator.password")
        .populate([
          {
            path: "customer",
            select: "id firstname fathername grandfathername",
          },
          { path: "bedRooms", select: "id name" },
          { path: "creator", select: "id name code" },
          { path: "feeTypeDetails", select: "id name amount" },
        ]);

      if (!subscription) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      const subscriptionData = {
        id: subscription._id,
        propertyType: subscription.propertyType,
        location: subscription.location,
        description: subscription.description,
        status: subscription.status,
        customer: subscription.customer ? subscription.customer : null,
        bedRooms: subscription.bedRooms ? subscription.bedRooms : null,
        creator: subscription.creator ? subscription.creator : null,
        feeTypes: subscription.feeTypeDetails
          ? subscription.feeTypeDetails.map((ftp) => ({
              id: ftp._id,
              name: ftp.name,
              amount: ftp.amount,
            }))
          : [],
        createdAt: subscription.createdAt,
      };

      return Response.successResponse(res, res.statusCode, subscriptionData);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  update: async (req, res) => {
    try {
      const body = req.body;
      const subscription = await Subscription.findById(body.id);

      if (!subscription) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      subscription.propertyType = body.propertyType || subscription.propertyType;
      subscription.location = body.location || subscription.location;
      subscription.customerId = body.customerId || subscription.customerId;
      subscription.bedRoomId = body.bedRoomId || subscription.bedRoomId;
      subscription.adminId = body.adminId || subscription.adminId;
      subscription.description = body.description || subscription.description;
      subscription.status = body.status;
      subscription.updatedAt = DateUtil.currentDate();

      const updatedLocation = await subscription.save();

      const action = `Updated ${moduleName} - ${subscription.code}`;
      const person = body.actionBy;

      await createActivityLog(moduleName, action, person);

      return res.status(res.statusCode).json(updatedLocation);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  delete: async (req, res) => {
    try {
      const param = req.params;
      const userId = param.actionBy;

      const subscription = await Subscription.findById(param.id);

      if (!subscription) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      await subscription.deleteOne();

      const action = `Deleted ${moduleName} - ${subscription.code}`;
      await createActivityLog(moduleName, action, userId);

      return res.status(res.statusCode).json({
        message: ResponseMessage.SUCCESS_MESSAGE,
      });
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },
};
