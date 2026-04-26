const User = require("../models/User");
const Assignment = require("../models/Assignment");
const School = require("../models/School");

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const assignmentData = req.body;

    const school = await School.findById(req.params.school_id);
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const AssignmentDoc = new Assignment(assignmentData);

    await AssignmentDoc.save();

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: AssignmentDoc,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to create assignment" });
  }
};

// Get assignments for a school
exports.getAssignments = async (req, res) => {
  try {
    const { school_name } = req.params;
    const { search, class: classFilter, subject } = req.query;

    let query = { school_name };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (classFilter) {
      query.classLevel = classFilter;
    }
    if (subject) {
      query.Subject = subject;
    }

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to fetch assignments" });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const assignment = await Assignment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to update assignment" });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message || "Failed to delete assignment" });
  }
};
