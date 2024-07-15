const router = require("express").Router();
const { bearerToken } = require("../../authentication/auth");

const customerController = require("../../controllers/version1/customer");

router.post("/", customerController.create);
router.patch("/forgot/password", customerController.resetPassword);
router.post("/login", customerController.login);

router.use(bearerToken);

router.get("/", customerController.getAll);
router.get("/:id", customerController.get);
router.patch("/", customerController.update);
router.delete("/:id/:createdBy", customerController.delete);
router.patch("/change/password", customerController.changePassword);

module.exports = router;