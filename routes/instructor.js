const express = require("express");
const instructor = require("../controller/instructorController");
const uploadImage = require("../middlewares/middlewareUpload");

const router = express.Router();

router.post("/addInstructor", instructor.addInstructor);
router.get("/getAllData", instructor.getAllData);
router.get("/getInstructorById/:id", instructor.getInstructorById);
router.delete("/delete/:uid", instructor.delete);
// router.put("/updaddInstructor", instructor.updaddInstructor);

module.exports = router;
