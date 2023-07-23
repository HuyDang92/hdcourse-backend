const express = require("express");
const auth = require("../controller/courseController");
const middlewareController = require("../middlewares/middleWareUserController");
const router = express.Router();

router.post("/addCourse", auth.addCourse);
router.delete("/delete/:uid", auth.delete);
router.get("/getAllData", auth.getAllData);
// router.post("/getCourseById", auth.getCourseById);
// router.put("/updateCourse", auth.updateCourse);

module.exports = router;
