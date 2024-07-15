const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
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
        delete ret.roleId;
        delete ret._id;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.roleId;
        delete ret._id;
      },
    },
  }
);

// Add a unique compound index for username and name
agentSchema.index({ username: 1, name: 1 }, { unique: true });

agentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

agentSchema.virtual("role", {
  ref: "Role",
  localField: "roleId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Agent", agentSchema);
