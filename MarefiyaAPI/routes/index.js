require("dotenv").config();
const express = require("express");
const router = express.Router();
const version = process.env.API_VERSION;

// version1 Routes
const roleRouter = require("./version1/role");
const adminRouter = require("./version1/admin");
const agentRouter = require("./version1/agent");
const bedRoomRouter = require("./version1/bedroom");
const feeTypeRouter = require("./version1/feetype");
const customerRouter = require("./version1/customer");
const permissionRouter = require("./version1/permission");
const subscriptionRouter = require("./version1/subscription");

router.use(`/v${version}/roles`, roleRouter);
router.use(`/v${version}/admins`, adminRouter);
router.use(`/v${version}/agents`, agentRouter);
router.use(`/v${version}/bedrooms`, bedRoomRouter);
router.use(`/v${version}/feetypes`, feeTypeRouter);
router.use(`/v${version}/customers`, customerRouter);
router.use(`/v${version}/permissions`, permissionRouter);
router.use(`/v${version}/subscriptions`, subscriptionRouter);

module.exports = router;
