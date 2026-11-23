const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "university.db");
const db = new sqlite3.Database(dbPath);

db.run(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL,
    title TEXT NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT NOT NULL,
    semester TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database and courses table created successfully.");
  }

  db.close();
});