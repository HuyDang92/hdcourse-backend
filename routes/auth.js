const express = require("express");
const auth = require("../controller/authController");
const middlewareController = require("../middlewares/middleWareUserController");
const uploadImage = require("../middlewares/middlewareUpload");
const router = express.Router();

router.get("/getWishList/:idUser", auth.getWishList);
router.post("/addWishList", auth.addWishList);
router.post("/addUser", auth.addUser);
router.post("/create", middlewareController.verifyToken, auth.create);
router.delete("/delete/:uid", middlewareController.verifyToken, auth.delete);
router.get("/getAllData", middlewareController.verifyToken, auth.getAllUser);
router.post("/getUserById", middlewareController.verifyToken, auth.getUserById);
router.get("/getUserByIdQuery/:id", auth.getUserByIdQuery);
router.put("/updateProfile", uploadImage("users_avatar").single("photoURLNew"), auth.updateProfile);

module.exports = router;
