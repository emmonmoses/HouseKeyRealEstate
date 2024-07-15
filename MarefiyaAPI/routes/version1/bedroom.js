const router = require("express").Router();
const { bearerToken } = require("../../authentication/auth");
const bedroomController = require("../../controllers/version1/bedroom");

router.use(bearerToken);

router.post("/", bedroomController.create);
router.patch("/", bedroomController.update);
router.get("/", bedroomController.getBeds);
router.get("/:id", bedroomController.getBedById);
router.delete("/:id/:createdBy", bedroomController.delete);

module.exports = router;
