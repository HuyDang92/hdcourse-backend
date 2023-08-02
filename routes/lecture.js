const express = require("express");
const lecture = require("../controller/lectureController");
const uploadImage = require("../middlewares/middlewareUpload");

const router = express.Router();

router.post("/addLecture", lecture.addLecture);
router.delete("/delete/:uid", lecture.delete);
router.get("/getAllLecture/:idCourse", lecture.getAllLecture);
router.get("/getLectureById/:idLecture", lecture.getLectureById);
// router.put("/updateCourse", lecture.updateCourse);

module.exports = router;
