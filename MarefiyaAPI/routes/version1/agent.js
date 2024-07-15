const router = require("express").Router();
const { bearerToken } = require("../../authentication/auth");
const uploadUtility = require("../../utilities/upload_utility");
const agentController = require("../../controllers/version1/agent");

// let destination = `uploads/systemusers/`;

router.post("/", agentController.create);
router.post("/login", agentController.login);
router.patch("/forgot/password", agentController.resetPassword);
// router.get("/image/:code/:avatar", uploadUtility.getImage(destination));

router.use(bearerToken);

// router.post(
//   "/upload/:code",
//   uploadUtility.uploadAvatar(destination),
//   uploadUtility.uploadImage
// );

router.get("/:id", agentController.get);
router.get("/", agentController.getAgents);
router.patch("/", agentController.update);
router.delete("/:id/:createdBy", agentController.delete);
router.get("/role/:id", agentController.getAgentsByRole);
router.patch("/change/password", agentController.changePassword);

module.exports = router;
