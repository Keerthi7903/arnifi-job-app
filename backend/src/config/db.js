const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        type TEXT NOT NULL,
        location TEXT NOT NULL,
        admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        applied_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, job_id)
      );
    `);

    await seedJobs();
    console.log("DB initialized successfully");
  } catch (err) {
    console.error("DB init error:", err.message);
    throw err;
  }
};

const seedJobs = async () => {
  const bcrypt = require("bcryptjs");

  // Create seed admin if not exists
  const existing = await pool.query("SELECT id FROM users WHERE email=$1", ["seed@arnifi.com"]);
  let adminId;

  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash("Seed@1234", 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id",
      ["Arnifi Admin", "seed@arnifi.com", hash, "admin"]
    );
    adminId = result.rows[0].id;
  } else {
    adminId = existing.rows[0].id;
  }

  // Check if jobs already seeded
  const jobCount = await pool.query("SELECT COUNT(*) FROM jobs WHERE admin_id=$1", [adminId]);
  if (parseInt(jobCount.rows[0].count) > 0) return;

  // Seed jobs
  const jobs = [
    ["Arnifi Corporate Services", "Full Stack Developer", "Full Time", "Dubai, UAE"],
    ["Arnifi Corporate Services", "Frontend Engineer", "Full Time", "Remote"],
    ["Arnifi Corporate Services", "Backend Engineer", "Full Time", "Dubai, UAE"],
    ["Google", "Software Engineer", "Full Time", "Bengaluru, India"],
    ["Google", "Product Manager", "Full Time", "Hyderabad, India"],
    ["Microsoft", "Cloud Engineer", "Full Time", "Bengaluru, India"],
    ["Microsoft", "DevOps Engineer", "Full Time", "Remote"],
    ["Amazon", "Data Engineer", "Full Time", "Bengaluru, India"],
    ["Amazon", "Frontend Developer", "Part Time", "Remote"],
    ["Flipkart", "React Developer", "Full Time", "Bengaluru, India"],
    ["Flipkart", "Node.js Developer", "Full Time", "Bengaluru, India"],
    ["Swiggy", "Mobile Developer", "Full Time", "Bengaluru, India"],
    ["Swiggy", "UI/UX Designer", "Part Time", "Remote"],
    ["Zomato", "Backend Developer", "Full Time", "Gurugram, India"],
    ["Zomato", "Data Analyst", "Part Time", "Remote"],
    ["Infosys", "Java Developer", "Full Time", "Pune, India"],
    ["TCS", "Python Developer", "Full Time", "Chennai, India"],
    ["Wipro", "QA Engineer", "Full Time", "Hyderabad, India"],
    ["Razorpay", "Payments Engineer", "Full Time", "Bengaluru, India"],
    ["CRED", "React Native Developer", "Full Time", "Bengaluru, India"],
  ];

  for (const [company, position, type, location] of jobs) {
    await pool.query(
      "INSERT INTO jobs (company, position, type, location, admin_id) VALUES ($1,$2,$3,$4,$5)",
      [company, position, type, location, adminId]
    );
  }

  console.log("Seeded 20 sample jobs!");
};

module.exports = { pool, initDB };