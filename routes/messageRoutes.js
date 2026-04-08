const express = require("express");
const router = express.Router();
const {
  createmsg,
  getmessageges,
  deletemessage,
} = require("../controllers/messageController.js");

router.post("/create", createmsg); // login any user (super-admin, admin, student)
router.get("/get/:id", getmessageges); // get msg
router.delete("/delete/:id", deletemessage); // delete msg
module.exports = router;
