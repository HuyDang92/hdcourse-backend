const express = require("express");
const cate = require("../controller/categoryController");
const middlewareController = require("../middlewares/middleWareUserController");
const router = express.Router();

router.get("/getAllCat", cate.getAllCat);
router.get("/getCatLevelOne", cate.getCatLevelOne);
router.get("/getAllCatLevelTwo", cate.getAllCatLevelTwo);
router.get("/getAllCatLevelThree", cate.getAllCatLevelThree);
router.post("/getCatLevelTwo", cate.getCatLevelTwo);
router.post("/getCatLevelThree", cate.getCatLevelThree);
router.post("/addCatLevelThree", cate.addCatLevelThree);
// router.delete("/delete/:uid", cate.delete);
// router.post("/getCourseById", auth.getCourseById);
// router.put("/updateCourse", auth.updateCourse);

module.exports = router;
