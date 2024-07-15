// MODELS
const BedRoom = require("../../models/bedroom");

// VALIDATIONS
const { bedRoomValidation } = require("../../validations/bedroom");

// UTILITIES
const Response = require("../../utilities/response_utility");
const Date_Utility = require("../../utilities/date_utility");
const ResponseMessage = require("../../utilities/messages_utility");
const PaginationUtility = require("../../utilities/pagination_utility");
const { createActivityLog } = require("../../utilities/activitylog_utility");

const moduleName = "Bedroom";

module.exports = {
  create: async (req, res) => {
    try {
      const bedData = req.body;

      const { error } = bedRoomValidation(bedData);

      if (error) {
        return Response.errorResponse(res, 400, error);
      }

      const bedroom = new BedRoom({
        name: bedData.name,
        quantity: bedData.quantity,
        createdAt: Date_Utility.currentDate(),
      });

      const newPriviledge = await bedroom.save();

      const action = `New ${moduleName}`;
      const person = bedData.actionBy;
      await createActivityLog(moduleName, action, person);

      return Response.successResponse(res, res.statusCode, newPriviledge);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  getBeds: async (req, res) => {
    try {
      const totalBedRooms = await BedRoom.countDocuments();
      const { pagination, skip } = await PaginationUtility.paginationParams(
        req,
        totalBedRooms
      );

      if (pagination.page > pagination.pages) {
        return res.status(200).json({
          message: `Page number ${pagination.page} is greater than the total number of pages that is ${pagination.pages}`,
        });
      }

      pagination.data = await BedRoom.find()

        .select("-updatedAt -createdAt")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pagination.pageSize)
        .lean();

      pagination.data = pagination.data.map((bedroom) => {
        bedroom.id = bedroom._id.toHexString();

        return bedroom;
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

  getBedById: async (req, res) => {
    try {
      const bedroomId = req.params.id;

      const bedroom = await BedRoom.findById(bedroomId)
        .select("-updatedAt -createdAt")
        .lean();

      if (!bedroom) {
        return Response.errorResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      bedroom.id = bedroom._id.toHexString();

      return Response.successResponse(res, res.statusCode, bedroom);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },

  delete: async (req, res) => {
    try {
      const bed = await BedRoom.findById(req.params.id);

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
      const bedroom = await BedRoom.findById(req.body.id);
      console.log(bedroom);

      if (!bedroom) {
        return Response.customResponse(res, 404, ResponseMessage.NO_RECORD);
      }

      bedroom.name = req.body.name || bedroom.name;
      bedroom.quantity = req.body.quantity || bedroom.quantity;
      bedroom.updatedAt = Date_Utility.currentDate();
      const updatedBedroom = await bedroom.save();

      const action = `Updated ${moduleName} - ${bedroom._id}`;
      const person = req.body.actionBy;
      await createActivityLog(moduleName, action, person);

      return Response.successResponse(res, res.statusCode, updatedBedroom);
    } catch (err) {
      return Response.errorResponse(res, 500, err);
    }
  },
};
