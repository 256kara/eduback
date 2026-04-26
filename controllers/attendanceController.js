const Attendance = require("../models/Attendance");
const School = require("../models/School");
const Student = require("../models/Student");
const User = require("../models/User");

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;

    // Validate school exists
    const school = await School.findById(attendanceData.school);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Validate student exists
    const student = await Student.findById(attendanceData.student);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Validate user marking attendance
    const markedBy = await User.findById(attendanceData.markedBy);
    if (!markedBy) {
      return res.status(404).json({ error: "User not found" });
    }

    const attendanceDoc = new Attendance(attendanceData);
    await attendanceDoc.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: attendanceDoc,
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to mark attendance" });
  }
};

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { school_id, student_id, date, status } = req.query;

    let query = {};

    if (school_id) {
      query.school = school_id;
    }
    if (student_id) {
      query.student = student_id;
    }
    if (date) {
      // Assuming date is in YYYY-MM-DD format
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (status) {
      query.status = status;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("school", "name")
      .populate("student", "name rollNumber")
      .populate("markedBy", "name email")
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      message: "Attendance records fetched successfully",
      attendance: attendanceRecords,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to fetch attendance" });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const attendance = await Attendance.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("school student markedBy");

    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to update attendance" });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.status(200).json({
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to delete attendance" });
  }
};
