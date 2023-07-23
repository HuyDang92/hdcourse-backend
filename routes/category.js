const express = require("express");
const cate = require("../controller/categoryController");
const middlewareController = require("../middlewares/middleWareUserController");
const router = express.Router();

router.get("/getCatLevelOne", cate.getCatLevelOne);
router.post("/getCatLevelTwo", cate.getCatLevelTwo);
router.post("/getCatLevelThree", cate.getCatLevelThree);
// router.post("/addCourse", cate.addCourse);
// router.delete("/delete/:uid", cate.delete);
// router.post("/getCourseById", auth.getCourseById);
// router.put("/updateCourse", auth.updateCourse);

module.exports = router;
