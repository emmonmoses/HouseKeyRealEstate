const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
    firstname: {
      type: String,
    },
    fathername: {
      type: String,
    },
    grandfathername: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    phone: {
      code: {
        type: String,
      },
      number: {
        type: Number,
      },
    },
    address: {
      city: {
        type: String,
      },
      subCity: {
        type: String,
      },
      kebele: {
        type: String,
      },
      houseNumber: {
        type: String,
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    createdAt: {
      type: Date,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      immutable: true,
    },
  },
  {
    versionKey: false,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.roleId;
        delete ret.password;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.roleId;
        delete ret.password;
      },
    },
  }
);

customerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

customerSchema.virtual("role", {
  ref: "Role",
  localField: "roleId",
  foreignField: "_id",
  justOne: true,
});

customerSchema.virtual("route", {
  ref: "Route",
  localField: "routeId",
  foreignField: "_id",
  justOne: true,
});

customerSchema.virtual("time", {
  ref: "Timing",
  localField: "timingId",
  foreignField: "_id",
  justOne: true,
});

customerSchema.virtual("tripType", {
  ref: "TripType",
  localField: "tripTypeId",
  foreignField: "_id",
  justOne: true,
});
module.exports = mongoose.model("Customer", customerSchema);
