const Timetable = require("../models/Timetable");
const School = require("../models/School");
const Teacher = require("../models/Teacher");

// Create a new timetable entry
exports.createTimetable = async (req, res) => {
  try {
    const { school_name, classLevel, day, periods } = req.body;

    // Find the school
    const school = await School.findOne({ name: school_name });
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Validate that all teachers exist and belong to the school
    for (const period of periods) {
      const teacher = await Teacher.findOne({
        _id: period.teacher,
        school: school._id
      });
      if (!teacher) {
        return res.status(404).json({
          error: `Teacher with ID ${period.teacher} not found in this school`
        });
      }
    }

    // Check if timetable already exists for this school, class, and day
    const existingTimetable = await Timetable.findOne({
      school: school._id,
      classLevel,
      day,
    });

    if (existingTimetable) {
      return res.status(409).json({
        error: "Timetable already exists for this class and day"
      });
    }

    const timetable = new Timetable({
      school: school._id,
      classLevel,
      day,
      periods,
      createdBy: req.user.id,
    });

    await timetable.save();

    res.status(201).json({
      message: "Timetable created successfully",
      timetable,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get timetables for a school
exports.getTimetables = async (req, res) => {
  try {
    const { school_name } = req.params;
    const { classLevel, day } = req.query;

    const school = await School.findOne({ name: school_name });
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    let query = { school: school._id };

    if (classLevel) {
      query.classLevel = classLevel;
    }
    if (day) {
      query.day = day;
    }

    const timetables = await Timetable.find(query)
      .populate("periods.teacher", "name email")
      .sort({ day: 1, classLevel: 1 });

    res.status(200).json({
      message: "Timetables fetched successfully",
      timetables,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a specific timetable by ID
exports.getTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findById(id)
      .populate("periods.teacher", "name email")
      .populate("school", "name");

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.status(200).json({
      message: "Timetable fetched successfully",
      timetable,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { classLevel, day, periods } = req.body;

    const timetable = await Timetable.findById(id);
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    // Validate teachers if periods are being updated
    if (periods) {
      for (const period of periods) {
        const teacher = await Teacher.findOne({
          _id: period.teacher,
          school: timetable.school
        });
        if (!teacher) {
          return res.status(404).json({
            error: `Teacher with ID ${period.teacher} not found in this school`
          });
        }
      }
    }

    const updatedTimetable = await Timetable.findByIdAndUpdate(
      id,
      {
        ...(classLevel && { classLevel }),
        ...(day && { day }),
        ...(periods && { periods }),
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("periods.teacher", "name email");

    res.status(200).json({
      message: "Timetable updated successfully",
      timetable: updatedTimetable,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a timetable
exports.deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findByIdAndDelete(id);

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.status(200).json({
      message: "Timetable deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get available teachers for timetable creation
exports.getAvailableTeachers = async (req, res) => {
  try {
    const { school_name } = req.params;

    const school = await School.findOne({ name: school_name });
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const teachers = await Teacher.find({
      school: school._id,
      status: "active"
    }).select("name email subjects");

    res.status(200).json({
      message: "Teachers fetched successfully",
      teachers,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};