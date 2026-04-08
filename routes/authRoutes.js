const express = require("express");
const router = express.Router();
const {
  signupSuperAdmin,
  login,
  validateToken,
} = require("../controllers/authController");
const { signupAdmin } = require("../controllers/adminController");

router.post("/signup-super-admin", signupSuperAdmin); // signup super admin
router.post("/signup-admin", signupAdmin); // signup normal admin
router.post("/login", login); // login any user (super-admin, admin, student)
router.post("/validate-token", validateToken);
module.exports = router;
