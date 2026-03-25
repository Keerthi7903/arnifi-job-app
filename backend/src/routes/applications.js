const router = require("express").Router();
const { pool } = require("../config/db");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT j.*, a.applied_at FROM applications a
       JOIN jobs j ON a.job_id=j.id
       WHERE a.user_id=$1
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;