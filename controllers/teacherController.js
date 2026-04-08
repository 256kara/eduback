const User = require("../models/User");
const Teacher = require("../models/Teacher");
const express = require("express");
const router = express.Router();
const School = require("../models/School");
const bcrypt = require("bcrypt");

// Signup teacher -- cleared, create teacher with user relationship, teacher and user created together, no orphan teacher or user
exports.signupTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      school_name,
      phone,
      role,
      userId,
      subjects,
      qualification,
      experience,
      address,
      status,
      gender,
    } = req.body;
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
          "A user with this email exists in your school. Try updating user's role to teacher instead!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "teacher",
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
    });

    await teacher.save();

    res.status(200).json({ message: "Teacher created successfully!" });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Delete teacher -- cleared, teacher and user deleted together, no orphan teacher or user
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({ userId: id });
    if (!teacher) {
      return res.json({ message: "No such teacher found" });
    }
    await User.findByIdAndDelete(id);
    await Teacher.findByIdAndDelete(teacher._id);
    res.json({ message: "Teacher deleted successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Update teacher -- cleared, teacher and user updated together, no orphan teacher or user
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const teacher = await Teacher.findOne({ userId: id });
    if (!teacher) {
      return res.json({ message: "No such teacher found" });
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacher._id, data, {
      new: true,
    });
    const updatedUser = await User.findByIdAndUpdate(
      updatedTeacher.userId,
      data,
      {
        new: true,
      },
    );
    res.json({ updatedTeacher, updatedUser });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Get all teachers of a school -- cleared, get all teachers with their user data
exports.getTeachers = async (req, res) => {
  try {
    const { school_id } = req.params;
    const teachers = await Teacher.find({ school: school_id });

    const teachersWithUserData = [];
    for (const teacher of teachers) {
      const user = await User.findById(teacher.userId);
      teachersWithUserData.push({ ...teacher.toObject(), user });
    }

    res.json({ teachers: teachersWithUserData });
  } catch (err) {
    res.status(400).json(err.message);
  }
};
