const router = require("express").Router();
const { bearerToken } = require("../../authentication/auth");
const subscriptionController = require("../../controllers/version1/subscription");

router.use(bearerToken);

router.get("/:id", subscriptionController.get);
router.post("/", subscriptionController.create);
router.patch("/", subscriptionController.update);
router.get("/", subscriptionController.getSubscriptions);
router.delete("/:id/:actionBy", subscriptionController.delete);
router.get("/customer/:customerId", subscriptionController.getSubscriptionByCustomer);

module.exports = router;
