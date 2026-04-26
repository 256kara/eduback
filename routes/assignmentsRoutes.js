const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

router.post("/create-assignment/:school_id", createAssignment); // create assignment

router.get("/get-assignments/:school_id", getAssignments); // get assignments for a school

router.put("/:id", updateAssignment); // update assignment

router.delete("/:id", deleteAssignment); // delete assignment

module.exports = router;
