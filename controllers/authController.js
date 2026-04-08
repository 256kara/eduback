const User = require("../models/User");
const School = require("../models/School");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup super admin
exports.signupSuperAdmin = async (req, res) => {
  try {
    // signup details from request body
    const {
      name,
      email,
      password,
      school_name,
      phone,
      location,
      plan,
      isActive,
    } = req.body;

    name = name.trim();
    email = email.trim().toLowerCase();
    school_name = school_name.trim();
    phone = phone.trim();
    location = location.trim();
    plan = plan.trim();

    // find school match
    let school = await School.findOne({ name: school_name });

    // if no school match, create the school
    if (school) {
      return res.json({ school_error: "That school is already registered!" });
    }

    school = new School({ name: school_name, location, plan, isActive });
    await school.save();

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "super-admin",
      school: school._id,
      phone,
      isActive,
    });

    // saving user
    await user.save();
    res.status(200).json({ message: "Super Admin created" });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Login any user
exports.login = async (req, res) => {
  try {
    let { name, email, password, school_name } = req.body;
    name = name.trim();
    email = email.trim().toLowerCase();
    school_name = school_name.trim();

    const school = await School.findOne({ name: school_name });

    if (!school) {
      return res.json({ error: "No such school found!" });
    }

    const user = await User.findOne({ name, email, school: school._id });

    if (!user || !(await bcrypt.compare(password, user.password)) || !school) {
      return res.json({ error: "Invalid credentials" });
    }
    const payload = {
      id: user._id,
      role: user.role,
      school_name: school.name,
      school_id: school._id,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token: token });
  } catch (err) {
    res.status(400).json({ error: err.message || "Login failed" });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.body.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) return res.json({ error: "Invalid token" });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: "Error validating token" });
  }
};
