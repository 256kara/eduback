const express = require("express");

const router = express.Router();
const {
  addSubject,
  updateSubject,
  asignSubject,
} = require("../controllers/subjectController");

router.post("/add-subject", addSubject);
router.post("/update-subject/:id", updateSubject);
router.post("/asign-subject/:studentId/:subjectId", asignSubject);

module.exports = router;
