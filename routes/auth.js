const express = require("express");
const auth = require("../controller/authController");
const middlewareController = require("../middlewares/middleWareUserController");
const uploadImage = require("../middlewares/middlewareUpload");
const router = express.Router();

router.post("/signIn", auth.signIn);
router.post("/addUser", auth.addUser);
router.post("/create", middlewareController.verifyToken, auth.create);
router.delete("/delete/:uid", middlewareController.verifyToken, auth.delete);
router.get("/getAllData", middlewareController.verifyToken, auth.getAllUser);
router.post("/getUserById", middlewareController.verifyToken, auth.getUserById);
router.put("/updateProfile", uploadImage.single("photoURL"), auth.updateProfile);

module.exports = router;
