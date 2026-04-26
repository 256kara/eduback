const express = require("express");
const router = express.Router();

const {
  signupTeacher,
  deleteTeacher,
  updateTeacher,
  getTeachers,
  getTeacher,
  assignTeacherRole,
} = require("../controllers/teacherController");

router.post("/", signupTeacher);
router.get("/school/:school_id", getTeachers);
router.get("/:id", getTeacher);
router.put("/:id", updateTeacher);
router.patch("/:id/role", assignTeacherRole);
router.delete("/:id", deleteTeacher);

module.exports = router;
