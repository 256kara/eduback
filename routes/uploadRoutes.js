const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const Student = require("../models/Student");
const User = require("../models/User");
const School = require("../models/School");
const bcrypt = require("bcrypt");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/students/import", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { school_name } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!school_name) {
      return res.status(400).json({ message: "School name is required" });
    }

    // Find the school
    const school = await School.findOne({ name: school_name });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process each student
    for (const row of rawData) {
      try {
        // Map Excel columns to database fields
        const studentData = {
          name: row.NAME || row.name,
          email: row.EMAIL || row.email,
          admissionNumber: row["ADMISSION NO"] || row.admissionNumber,
          classLevel: row.CLASS || row.classLevel || row.class,
          stream: row.STREAM || row.stream || "N/A",
          gender: (row.GENDER || row.gender || "male").toLowerCase(),
          phone: row.PHONE || row.phone || "N/A",
          nin: row.NIN || row.nin || "",
          combination: row.COMBINATION || row.combination || "N/A",
          address: row.ADDRESS || row.address || "N/A",
          healthStatus: row["HEALTH STATUS"] || row.healthStatus || "N/A",
          emergencyContact:
            row["EMERGENCY CONTACT"] || row.emergencyContact || "N/A",
          username: row.USERNAME || row.username,
          lin: row.LIN || row.lin || "Kmss",
          password: row.PASSWORD || row.password || "defaultpassword123",
        };

        // Validate required fields
        if (
          !studentData.name ||
          !studentData.email ||
          !studentData.admissionNumber ||
          !studentData.username
        ) {
          results.failed++;
          results.errors.push(
            `Row ${rawData.indexOf(row) + 2}: Missing required fields (name, email, admissionNumber, username)`,
          );
          continue;
        }

        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { email: studentData.email, school: school._id },
            { name: studentData.name, school: school._id, role: "student" },
          ],
        });

        if (existingUser) {
          results.failed++;
          results.errors.push(
            `Row ${rawData.indexOf(row) + 2}: Student with email ${studentData.email} or name ${studentData.name} already exists`,
          );
          continue;
        }

        // Check if admission number already exists
        const existingStudent = await Student.findOne({
          admissionNumber: studentData.admissionNumber,
          school: school._id,
        });

        if (existingStudent) {
          results.failed++;
          results.errors.push(
            `Row ${rawData.indexOf(row) + 2}: Admission number ${studentData.admissionNumber} already exists`,
          );
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(studentData.password, 10);

        // Create user
        const user = new User({
          name: studentData.name,
          email: studentData.email,
          gender: studentData.gender,
          phone: studentData.phone,
          role: "student",
          password: hashedPassword,
          school: school._id,
        });
        await user.save();

        // Create student
        const student = new Student({
          userId: user._id,
          name: studentData.name,
          email: studentData.email,
          school: school._id,
          gender: studentData.gender,
          classLevel: studentData.classLevel,
          phone: studentData.phone,
          admissionNumber: studentData.admissionNumber,
          stream: studentData.stream,
          combination: studentData.combination,
          nin: studentData.nin,
          address: studentData.address,
          healthStatus: studentData.healthStatus,
          emergencyContact: studentData.emergencyContact,
          username: studentData.username,
          lin: studentData.lin,
          password: studentData.password, // Store plain password in student record
        });

        await student.save();

        // Update school student count
        await School.findByIdAndUpdate(school._id, {
          $inc: { studentsCount: 1 },
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Row ${rawData.indexOf(row) + 2}: ${error.message}`,
        );
      }
    }

    res.json({
      message: `Bulk import completed. ${results.success} students imported successfully, ${results.failed} failed.`,
      results,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during bulk import" });
  }
});

module.exports = router;
