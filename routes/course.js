const express = require("express");
const course = require("../controller/courseController");
const middlewareController = require("../middlewares/middleWareUserController");
const uploadImage = require("../middlewares/middlewareUpload");

const router = express.Router();

router.post("/ratingCourse", course.ratingCourse);
router.post("/addCourse", uploadImage("courses").single("thumb"), course.addCourse);
router.delete("/delete/:uid", course.delete);
router.get("/getRatingCouse/:idCourse", course.getRatingCouse);
router.get("/getAllData/:limit", course.getAllData);
router.get("/getAllDataCatHot", course.getAllDataCatHot);
router.get("/getAllDataByIdCat/:idCategory/:pageSize/:currentPage", course.getAllDataByIdCat);
router.get("/getAllDataFree/:idCategory/:pageSize/:currentPage/:free", course.getAllDataFree);
router.get("/getAllDataByName/:keywords/:pageSize/:currentPage", course.getAllDataByName);
router.get("/getCourseById/:id", course.getCourseById);
// router.put("/updateCourse", course.updateCourse);

module.exports = router;
