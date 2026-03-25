const router = require("express").Router();
const { pool } = require("../config/db");
const { authenticate, adminOnly } = require("../middleware/auth");

// GET all jobs
router.get("/", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT j.*, u.name as admin_name FROM jobs j JOIN users u ON j.admin_id=u.id ORDER BY j.created_at DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST create job (admin)
router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const { company, position, type, location } = req.body;
    if (!company || !position || !type || !location)
      return res.status(400).json({ message: "All fields required" });
    const { rows } = await pool.query(
      "INSERT INTO jobs (company,position,type,location,admin_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [company, position, type, location, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT update job (admin, own jobs only)
router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const { company, position, type, location } = req.body;
    const { rows } = await pool.query(
      "UPDATE jobs SET company=$1,position=$2,type=$3,location=$4 WHERE id=$5 AND admin_id=$6 RETURNING *",
      [company, position, type, location, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Job not found or unauthorized" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE job (admin, own jobs only)
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM jobs WHERE id=$1 AND admin_id=$2 RETURNING id",
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Job not found or unauthorized" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST apply to job (user only)
router.post("/:id/apply", authenticate, async (req, res) => {
  try {
    if (req.user.role === "admin")
      return res.status(403).json({ message: "Admins cannot apply to jobs" });
    await pool.query(
      "INSERT INTO applications (user_id,job_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [req.user.id, req.params.id]
    );
    res.status(201).json({ message: "Applied successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;