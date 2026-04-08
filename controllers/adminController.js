const User = require("../models/User");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const School = require("../models/School");
const bcrypt = require("bcrypt");
const { ConnectionStates } = require("mongoose");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Payment = require("../models/Payment");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");

// Add a student -- cleared, create student with user relationship, student and user created together, no orphan student or user
exports.addStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      school_name,
      gender,
      classLevel,
      phone,
      admissionNumber,
      stream,
      combination,
      nin,
      address,
      feesBalance,
      healthStatus,
      emergencyContact,
      username,
      lin,
    } = req.body;

    const school = await School.findOne({ name: school_name });

    if (!school) {
      return res.json({ message: "No such school" });
    }

    const userExists = await User.findOne({
      email,
      school: school._id,
      role: "student",
    });

    if (userExists) {
      return res.json({
        error: "A student with such email and name exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      role: "student",
      password: hashedPassword,
      school: school._id,
    });
    await user.save();

    // cleared the user registration with the user credentials from the frontend .....
    const student = new Student({
      userId: user._id,
      name,
      school: school._id,
      gender,
      classLevel,
      phone,
      classLevel,
      admissionNumber,
      email,
      stream,
      combination,
      nin,
      address,
      feesBalance,
      healthStatus,
      emergencyContact,
      username,
      lin,
      password,
    });

    // student.subjects.push(subject._id);

    await student.save();

    await School.findByIdAndUpdate(school._id, { $inc: { studentsCount: 1 } });

    res.json({ message: "Student created successfully", student });

    // created user and student with relationship
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Get all students basing on school _id -- cleared
exports.getStudents = async (req, res) => {
  try {
    const { school_name } = req.params;

    const school = await School.findOne({ name: school_name });

    if (!school) {
      return res.json({ message: "No such school found." });
    }

    const school_id = school._id;

    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const search = req.query.search || "";
    const classFilter = req.query.class || "";

    const query = {
      name: { $regex: search, $options: "i" },
      school: school_id,
    };

    if (classFilter) {
      query.classLevel = classFilter;
    }

    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a student based on their _id -- cleared
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    const updatedStudent = await Student.findOneAndUpdate(
      { userId: id },
      data,
      {
        new: true,
      },
    );

    res.json({ updatedStudent, updatedUser });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Delete a student based on their _id
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);
    if (!student) {
      return res.json({ message: "No such student found" });
    }

    await User.findByIdAndDelete(id);
    await Student.deleteOne({ userId: id });

    res.json({ message: "Student deleted successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Signup admin -- cleared
exports.signupAdmin = async (req, res) => {
  try {
    const { name, email, password, school_name, phone } = req.body;

    const school = await School.findOne({ name: school_name });

    if (!school) {
      return res.json({ message: "No such school found!" });
    }

    const userExists = await User.findOne({
      email,
      school: school._id,
    });

    if (userExists) {
      return res.json({
        message:
          "A user with this email exists in your school. Try updating user's role to admin instead!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "admin",
      school: school._id,
    });
    await user.save();

    const admin = new Admin({
      name: user.name,
      userId: user._id,
      school: school._id,
    });

    await admin.save();

    res.status(200).json({ message: "Admin created successfully!" });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Delete admin -- cleared, admin and user deleted together, no orphan admin or user
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({ userId: id });
    if (!admin) {
      return res.json({ message: "No such admin found" });
    }

    await User.findByIdAndDelete(id);

    await Admin.findByIdAndDelete(admin._id);
    res.json({ message: "Admin deleted successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Update admin -- cleared, admin and user updated together
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const admin = await Admin.findOne({ userId: id });
    if (!admin) {
      return res.json({ message: "No such admin found" });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, data, {
      new: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      updatedAdmin.userId,
      data,
      {
        new: true,
      },
    );

    res.json({ updatedAdmin, updatedUser });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Get all admins of a school -- cleared, get all admins with their user data
exports.getAdmins = async (req, res) => {
  try {
    const { school_id } = req.params;
    const admins = await Admin.find({ school: school_id });

    if (admins.length === 0) {
      return res.json({ message: "No admins found." });
    }

    res.json({ admins });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Super-admin delete school account (system) -- cleared, school, super-admin, all teachers, all students, all subjects deleted together, no orphan data
exports.deleteSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    // check for the user from db and check the id presence
    if (!user || !id) {
      return res.json({ message: "All fields are required." });
    }

    const schooldata = await School.findById(user.school);

    const school = await School.findOne({ _id: schooldata._id });

    if (!school) {
      return res.json({ message: "No such school found." });
    }

    await User.findByIdAndDelete(id);
    await Student.deleteMany({ school: school._id });
    await User.deleteMany({ school: school._id });
    await School.findByIdAndDelete(school._id);
    await Admin.deleteMany({ school: school._id });
    await Teacher.deleteMany({ school: school._id });

    res.json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// load superAdmin profile
exports.loadProfile = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { user } = req.body;
    const profile = await User.findOne({
      _id: user.id,
      school: school_id,
      role: user.role,
    });

    if (!profile) {
      return res.json({ error: "failed to fetch profile" });
    }

    res.json({ profile });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Update subscription plan -- cleared, make payment and then update plan basing on the payment, 500 is foe basic, 1000 for moderate, 1500 for unlimited, update plan and update isActive to true if payment successful
exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const { plan, amount } = req.body;
    const school = await School.findById(req.params.id);

    if (!school) {
      return res.json({ message: "No such school found." });
    }

    const planCosts = {
      basic: 500,
      moderate: 1000,
      unlimited: 1500,
    };

    if (!planCosts[plan]) {
      return res.json({ message: "Invalid subscription plan." });
    }
    if (amount < planCosts[plan]) {
      return res.json({ message: "Insufficient payment amount." });
    }

    // Bsic plan - 30 days, Moderate plan - 30 days, Unlimited plan - 30 days, make payment and then update plan basing on the payment

    const paymentDetails = {
      school: school._id,
      plan,
      amount,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paymentDate: new Date(Date.now()),
    };

    const newPayment = new Payment(paymentDetails);
    await newPayment.save();

    school.plan = plan;
    school.isActive = true;
    await school.save();
    res.json({ message: "Subscription plan updated successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Mark attendance -- cleared, mark attendance for a student basing on their _id, create attendance record with student relationship, attendance and student created together, no orphan attendance or student
exports.markAttendance = async (req, res) => {
  try {
    const { student_id, marked_by } = req.params;
    const { status } = req.body;
    const student = await Student.findOne({ userId: student_id });
    if (!student) {
      return res.json({ message: "No such student found." });
    }
    const attendance = new Attendance({
      student: student.userId,
      status,
      markedBy: marked_by,
      school: student.school,
    });
    await attendance.save();

    res.json({ message: "Attendance marked successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Edit attendace -- cleared, edit attendance record basing on attendance _id, update attendance record with new status, updated attendance record returned
exports.editAttendance = async (req, res) => {
  try {
    const { attendance_id } = req.params;
    const { status } = req.body;
    const attendance = await Attendance.findById(attendance_id);
    if (!attendance) {
      return res.json({ message: "No such attendance record found." });
    }
    attendance.status = status;
    await attendance.save();
    res.json({ message: "Attendance updated successfully.", attendance });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// create subject -- cleared, create subject without school relationship, subject can be created without school relationship

exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;

    const subject = new Subject({
      name,
      code,
    });
    await subject.save();
    res.json({ message: "Subject created successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// mark results -- cleared, mark result for a student basing on their _id, create result record with student relationship, result and student created together, no orphan result or student
exports.markResults = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { score, subject, term, year } = req.body;
    const student = await Student.findOne({ userId: student_id });
    if (!student) {
      return res.json({ message: "No such student found." });
    }
    const result = new Result({
      student: student.userId,
      score,
      subject,
      term,
      year,
      school: student.school,
    });
    await result.save();
    res.json({ message: "Result marked successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};
