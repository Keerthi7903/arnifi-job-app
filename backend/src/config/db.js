const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
    max: 1,             
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });

const initDB = async () => {
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
  console.log("DB initialized");
};

module.exports = { pool, initDB };