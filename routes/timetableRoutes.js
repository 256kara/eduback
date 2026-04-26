const express = require("express");
const router = express.Router();

const {
  createTimetable,
  getTimetables,
  getTimetable,
  updateTimetable,
  deleteTimetable,
  getAvailableTeachers,
} = require("../controllers/timetableController");

router.post("/", createTimetable); // Create a new timetable
router.get("/:school_name", getTimetables); // Get timetables for a school
router.get("/single/:id", getTimetable); // Get a specific timetable
router.put("/:id", updateTimetable); // Update a timetable
router.delete("/:id", deleteTimetable); // Delete a timetable
router.get("/teachers/:school_name", getAvailableTeachers); // Get available teachers

module.exports = router;