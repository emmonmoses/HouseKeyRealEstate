const router = require("express").Router();
const { bearerToken } = require("../../authentication/auth");
const feeTypeController = require("../../controllers/version1/feetype");

router.use(bearerToken);

router.post("/", feeTypeController.create);
router.patch("/", feeTypeController.update);
router.get("/", feeTypeController.getFeeTypes);
router.get("/:id", feeTypeController.getFeeTypeById);
router.delete("/:id/:createdBy", feeTypeController.delete);

module.exports = router;
