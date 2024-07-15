const router = require("express").Router();
const { bearerToken } = require("../../authentication/auth");
const uploadUtility = require("../../utilities/upload_utility");
const adminController = require("../../controllers/version1/admin");

// let destination = `uploads/systemusers/`;

router.post("/", adminController.create);
router.post("/login", adminController.login);
router.patch("/forgot/password", adminController.resetPassword);
// router.get("/image/:code/:avatar", uploadUtility.getImage(destination));

router.use(bearerToken);

// router.post(
//   "/upload/:code",
//   uploadUtility.uploadAvatar(destination),
//   uploadUtility.uploadImage
// );

router.get("/:id", adminController.get);
router.get("/", adminController.getAdmins);
router.patch("/", adminController.update);
router.delete("/:id/:createdBy", adminController.delete);
router.get("/role/:id", adminController.getAdminsByRole);
router.patch("/change/password", adminController.changePassword);

module.exports = router;
