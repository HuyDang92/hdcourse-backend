const express = require("express");
const auth = require("../controller/authController");
const middlewareController = require("../middlewares/middleWareUserController");
const uploadImage = require("../middlewares/middlewareUpload");
const router = express.Router();

router.post("/addCart", middlewareController.verifyToken, auth.addCart);
router.get("/getCart/:idUser", middlewareController.verifyToken, auth.getCart);

router.post("/addWishList", middlewareController.verifyToken, auth.addWishList);
router.get("/getWishList/:idUser", middlewareController.verifyToken, auth.getWishList);

router.post("/addUserCourse", middlewareController.verifyToken, auth.addUserCourse);
router.get("/getUserCourse/:idUser", auth.getUserCourse);
router.get("/getOneUserCourse/:idUser/:idCourse", auth.getOneUserCourse);

router.post("/addUser", middlewareController.verifyToken, auth.addUser);
router.post("/create", middlewareController.verifyToken, auth.create);
router.delete("/delete/:uid", middlewareController.verifyToken, auth.delete);
router.put("/updateProfile", uploadImage("users_avatar").single("photoURLNew"), auth.updateProfile);

router.get("/getAllData", middlewareController.verifyToken, auth.getAllUser);
router.get(
   "/getDataLimit/:pageSize/:currentPage",
   middlewareController.verifyToken,
   auth.getDataLimit
);
router.get("/getUserByIdQuery/:id", auth.getUserByIdQuery);
router.post("/getUserById", auth.getUserById);

module.exports = router;
