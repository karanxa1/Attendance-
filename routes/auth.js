const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

const users = [
  { id: 1, email: "admin@example.com", password: bcrypt.hashSync("admin123", 10), role: "admin" },
  { id: 2, email: "teacher@example.com", password: bcrypt.hashSync("teacher123", 10), role: "teacher" }
];

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, role: user.role });
});

module.exports = router;
