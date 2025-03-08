const express = require("express");
const sheets = require("../config/googleSheets");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; 

// Fetch Attendance
router.get("/", authMiddleware, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:C100",
    });
    res.json(response.data.values);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark Attendance
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, studentId, status } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [[date, studentId, status]],
      },
    });

    res.json({ message: "Attendance recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
