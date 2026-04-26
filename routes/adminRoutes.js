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
  saveAttendanceRecords,
  getAttendanceBySchool,
  markAttendance,
  editAttendance,
  createSubject,
  markResults,
  loadProfile,
  getAssignments,
  deleteAssignment,
  signupTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  assignTeacherRole,
  deleteTeacher,
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
router.post("/attendance", saveAttendanceRecords); // save attendance batch for a school and class
router.get("/attendance/:school_name", getAttendanceBySchool); // get attendance records for a school and class
router.post("/mark-attendance/:student_id/:marked_by", markAttendance); // mark attendance for a student -- cleared, attendance marked by admin, teacher or super-admin, attendance record created with reference to the user who marked it
router.put("/edit-attendance/:attendance_id", editAttendance); // edit attendance record -- cleared, attendance record can be edited by admin, teacher or super-admin, attendance record updated with reference to the user who edited it
router.post("/create-subject", createSubject); // create subject -- cleared, subject created with reference to the school, only admin and super-admin can create subject
router.post("/mark-results/:student_id", markResults); // mark results for a student -- cleared, results marked by admin, teacher or super-admin, result record created with reference to the user who marked it
router.post("/load-profile/:school_id", loadProfile); // super-admin profile
router.get("/assignments/:school_name", getAssignments); // get assignments for a school
router.delete("/assignments/:id", deleteAssignment); // delete assignment
router.post("/signup-teacher", signupTeacher); // signup teacher -- cleared
router.get("/teachers/:school_name", getTeachers); // get all teachers of a school -- cleared
router.get("/teacher/:id", getTeacher); // get single teacher -- cleared
router.put("/update-teacher/:id", updateTeacher); // update teacher -- cleared
router.patch("/assign-teacher-role/:id", assignTeacherRole); // assign teacher role -- cleared
router.delete("/delete-teacher/:id", deleteTeacher); // delete teacher -- cleared
module.exports = router;
