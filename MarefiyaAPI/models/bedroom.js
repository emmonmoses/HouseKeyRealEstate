const mongoose = require("mongoose");

const bedRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true
    },
    quantity: {
      type: Number,
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
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

bedRoomSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("BedRoom", bedRoomSchema);
