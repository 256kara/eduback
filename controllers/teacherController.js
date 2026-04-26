const User = require("../models/User");
const Teacher = require("../models/Teacher");
const School = require("../models/School");
const bcrypt = require("bcrypt");

const normalizeString = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : value;

const getTeacherByIdOrUserId = async (id) => {
  return Teacher.findOne({ $or: [{ _id: id }, { userId: id }] });
};

exports.signupTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      school_name,
      phone,
      role,
      subjects,
      qualification,
      experience,
      address,
      status,
      gender,
    } = req.body;

    if (!name || !email || !password || !school_name) {
      return res
        .status(400)
        .json({ error: "Name, email, password, and school are required." });
    }

    const school = await School.findOne({ name: school_name });
    if (!school) {
      return res.status(404).json({ error: "No such school found." });
    }

    const normalizedEmail = normalizeString(email);
    const normalizedName = normalizeString(name);
    const userExists = await User.findOne({
      email: normalizedEmail,
      school: school._id,
    });
    if (userExists) {
      return res.status(409).json({
        error: "A user with this email already exists in your school.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "teacher";

    const user = new User({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: userRole,
      school: school._id,
      gender,
    });
    await user.save();

    const teacher = new Teacher({
      name: user.name,
      userId: user._id,
      school: school._id,
      email: user.email,
      phone,
      gender,
      subjects,
      qualification,
      experience,
      address,
      status,
      role: userRole,
    });
    await teacher.save();

    res.status(201).json({ message: "Teacher created successfully.", teacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await getTeacherByIdOrUserId(id);
    if (!teacher) {
      return res.status(404).json({ error: "No such teacher found." });
    }

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(teacher._id);

    res.status(200).json({ message: "Teacher deleted successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      gender,
      subjects,
      qualification,
      experience,
      address,
      status,
    } = req.body;
    const teacher = await getTeacherByIdOrUserId(id);
    if (!teacher) {
      return res.status(404).json({ error: "No such teacher found." });
    }

    const teacherUpdate = {
      ...(name ? { name: normalizeString(name) } : {}),
      ...(email ? { email: normalizeString(email) } : {}),
      ...(phone ? { phone } : {}),
      ...(gender ? { gender } : {}),
      ...(subjects ? { subjects } : {}),
      ...(qualification ? { qualification } : {}),
      ...(experience ? { experience } : {}),
      ...(address ? { address } : {}),
      ...(status ? { status } : {}),
      updatedAt: Date.now(),
    };

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacher._id,
      teacherUpdate,
      {
        new: true,
      },
    );

    const userUpdate = {
      ...(name ? { name: normalizeString(name) } : {}),
      ...(email ? { email: normalizeString(email) } : {}),
      ...(phone ? { phone } : {}),
      ...(gender ? { gender } : {}),
    };

    const updatedUser = await User.findByIdAndUpdate(
      teacher.userId,
      userUpdate,
      {
        new: true,
      },
    );

    res
      .status(200)
      .json({
        message: "Teacher updated successfully.",
        updatedTeacher,
        updatedUser,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignTeacherRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["teacher", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Role must be either 'teacher' or 'admin'." });
    }

    const teacher = await getTeacherByIdOrUserId(id);
    if (!teacher) {
      return res.status(404).json({ error: "No such teacher found." });
    }

    teacher.role = role;
    await teacher.save();
    const updatedUser = await User.findByIdAndUpdate(
      teacher.userId,
      { role },
      { new: true },
    );

    res
      .status(200)
      .json({
        message: "Teacher role updated successfully.",
        teacher,
        user: updatedUser,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { search, status, role } = req.query;

    const filter = { school: school_id };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }
    if (status) filter.status = status;
    if (role) filter.role = role;

    const teachers = await Teacher.find(filter)
      .populate("userId", "name email role phone gender")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: teachers.length, teachers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({
      $or: [{ _id: id }, { userId: id }],
    }).populate("userId", "name email role phone gender");
    if (!teacher) {
      return res.status(404).json({ error: "No such teacher found." });
    }

    res.status(200).json({ teacher });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
