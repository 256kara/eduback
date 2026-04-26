const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

router.post("/mark-attendance", markAttendance); // mark attendance

router.get("/get-attendance", getAttendance); // get attendance records with query params

router.put("/update-attendance/:id", updateAttendance); // update attendance

router.delete("/delete-attendance/:id", deleteAttendance); // delete attendance

module.exports = router;
