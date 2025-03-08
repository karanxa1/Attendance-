const { google } = require("googleapis");
const { readFileSync } = require("fs");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(readFileSync("service-account.json", "utf8")),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = sheets;
