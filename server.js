const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

const dbPath = path.join(__dirname, "database", "university.db");
const db = new sqlite3.Database(dbPath);

// GET all courses
app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(rows);
  });
});

// GET one course
app.get("/api/courses/:id", (req, res) => {
  db.get(
    "SELECT * FROM courses WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(row);
    }
  );
});

// POST new course
app.post("/api/courses", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  const sql = `
    INSERT INTO courses
    (courseCode, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [courseCode, title, credits, description, semester],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        courseCode,
        title,
        credits,
        description,
        semester
      });
    }
  );
});

// PUT existing course
app.put("/api/courses/:id", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  const sql = `
    UPDATE courses
    SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      courseCode,
      title,
      credits,
      description,
      semester,
      req.params.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({
        id: Number(req.params.id),
        courseCode,
        title,
        credits,
        description,
        semester
      });
    }
  );
});

// DELETE course
app.delete("/api/courses/:id", (req, res) => {
  db.run(
    "DELETE FROM courses WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});