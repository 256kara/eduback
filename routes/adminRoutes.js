const express = require("express");
const router = express.Router();

const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  signupAdmin,
  deleteSuperAdmin,
  deleteAdmin,
  updateAdmin,
  getAdmins,
  updateSubscriptionPlan,
  markAttendance,
  editAttendance,
  createSubject,
  markResults,
  loadProfile,
} = require("../controllers/adminController");

router.post("/signup-admin", signupAdmin); // signup normal admin -- cleared
router.delete("/delete-admin/:id", deleteAdmin); // delete normal admin -- cleared
router.put("/update-admin/:id", updateAdmin); // update normal admin -- cleared
router.get("/admins/:school_id", getAdmins); // get all admins of a school -- cleared
router.post("/signup-student", addStudent); // signup student -- cleared, student and user created together, no orphan student or user
router.get("/students/:school_name", getStudents); // get all students basing on school _id -- cleared
router.put("/update-student/:id", updateStudent); // update a student based on their _id -- cleared, student and user updated together, no orphan student or user
router.delete("/delete-student/:id", deleteStudent); // delete a student based on their _id -- cleared, student and user deleted together, no orphan student or user
router.delete("/delete-super-admin/:id", deleteSuperAdmin); // delete school account -- cleared, school, super-admin, all teachers, all students, all subjects deleted together, no orphan data
router.put("/update-subscription/:id", updateSubscriptionPlan); // update subscription plan of a school -- cleared
router.post("/mark-attendance/:student_id/:marked_by", markAttendance); // mark attendance for a student -- cleared, attendance marked by admin, teacher or super-admin, attendance record created with reference to the user who marked it
router.put("/edit-attendance/:attendance_id", editAttendance); // edit attendance record -- cleared, attendance record can be edited by admin, teacher or super-admin, attendance record updated with reference to the user who edited it
router.post("/create-subject", createSubject); // create subject -- cleared, subject created with reference to the school, only admin and super-admin can create subject
router.post("/mark-results/:student_id", markResults); // mark results for a student -- cleared, results marked by admin, teacher or super-admin, result record created with reference to the user who marked it
router.post("/load-profile/:school_id", loadProfile); // super-admin profile
module.exports = router;
