const express = require("express");
const course = require("../controller/courseController");
const middlewareController = require("../middlewares/middleWareUserController");
const uploadImage = require("../middlewares/middlewareUpload");

const router = express.Router();

router.post("/addCourse", uploadImage("courses").single("thumb"), course.addCourse);
router.delete("/delete/:uid", course.delete);
router.get("/getAllData/:limit", course.getAllData);
router.get("/getAllDataCatHot", course.getAllDataCatHot);
router.get("/getAllDataByIdCat/:idCategory/:pageSize/:currentPage", course.getAllDataByIdCat);
router.get("/getAllDataByNameCat/:nameCat", course.getAllDataByNameCat);
router.get("/getCourseById/:id", course.getCourseById);
// router.put("/updateCourse", course.updateCourse);

module.exports = router;
