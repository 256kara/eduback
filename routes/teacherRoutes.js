const express = require("express");
const router = express.Router();

const {
  signupTeacher,
  deleteTeacher,
  updateTeacher,
  getTeachers,
} = require("../controllers/teacherController");

router.post("/signup", signupTeacher);
router.post("/delete", deleteTeacher);
router.post("/update", updateTeacher);
router.get("/get", getTeachers);

module.exports = router;
