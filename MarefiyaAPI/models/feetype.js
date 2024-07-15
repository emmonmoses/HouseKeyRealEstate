const mongoose = require("mongoose");

const feeTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      unique: true,
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

feeTypeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("FeeType", feeTypeSchema);
