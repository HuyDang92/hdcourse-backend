const express = require("express");
const section = require("../controller/sectionController");

const router = express.Router();

router.post("/addSection", section.addSection);
router.delete("/delete/:uid", section.delete);
router.get("/getSectionByIdCourse/:idCourse", section.getSectionByIdCourse);
// router.put("/updateCourse", section.updateCourse);

module.exports = router;
