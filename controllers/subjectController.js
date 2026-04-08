const Subject = require("../models/Subject");
const Student = require("../models/Student");

exports.addSubject = async (req, res) => {
  try {
    const { name, code, short_name } = req.body;
    let subject = await Subject.findOne({ name });
    if (subject) {
      return res.json({ message: "Subject already exists." });
    }
    subject = new Subject({
      name,
      code,
      short_name,
    });
    await subject.save();
    res.json({ message: "Subject saved successfully" });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.updateSubject = async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.json({ message: "No such student found." });
    }
    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Updated subject successfully", subject });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// assign a subject to a student based on the student id and subject id
exports.asignSubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const student = await Student.findOne({ userId: studentId });

    // is the subject id is not included in the student's subjects list
    if (!student.subjects.includes(subjectId)) {
      student.subjects.push(subjectId);
      await student.save();
      res.json({ message: "Subject assigned to student successfully." });
    }

    res.json({ message: "Failed, subject already assigned." });

    res.json({ id, subId });
  } catch (err) {
    res.status(400).json(err.message);
  }
};
