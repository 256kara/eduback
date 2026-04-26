require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRoutes = require("./routes/messageRoutes");
const jwt = require("jsonwebtoken");
const uploadRoutes = require("./routes/uploadRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const assignmentRoutes = require("./routes/assignmentsRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1", "8.8.8.8"]); // Cloudflare + Google DNS

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());

function checkToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
    res.status(401).send("Access denied");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
      res.status(400).send("Invalid token");
      return;
    }
    req.user = decoded;
    next();
  });
}

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
  console.log("API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

app.use("/api/auth", authRoutes); // signup and login for super-admin, done.
app.use(checkToken);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/bulk", uploadRoutes);
// Serve static files
app.use(express.static("."));
// Teacher management page
app.get("/teachers", (req, res) => {
  res.sendFile(__dirname + "/teacher-management.html");
});
// Test route
app.get("/app", (req, res) => {
  const data = {
    name: "Edupulse API",
    version: "1.0.0",
    description: "API for Edupulse school management system",
  };
  res.json(data);
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
