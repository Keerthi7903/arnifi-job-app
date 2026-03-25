require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./config/db");

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));

app.get("/", function(req, res) {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Arnifi Jobs API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0a0a0f;
      color: #e8e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container { max-width: 800px; width: 100%; }
    .header { text-align: center; margin-bottom: 3rem; }
    .badge {
      display: inline-block;
      background: rgba(34,197,94,0.15);
      color: #22c55e;
      border: 1px solid rgba(34,197,94,0.3);
      padding: 0.3rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
    }
    h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    h1 span { color: #6c63ff; }
    .subtitle { color: #6b6b80; font-size: 1rem; }
    .version { color: #6c63ff; font-size: 0.85rem; margin-top: 0.3rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card {
      background: #13131a;
      border: 1px solid #1e1e2e;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .card h3 { font-size: 0.8rem; color: #6b6b80; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
    .endpoint { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; font-size: 0.85rem; }
    .method {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      min-width: 46px;
      text-align: center;
    }
    .get { background: rgba(59,130,246,0.15); color: #60a5fa; }
    .post { background: rgba(34,197,94,0.15); color: #4ade80; }
    .put { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .delete { background: rgba(239,68,68,0.15); color: #f87171; }
    .path { color: #a0a0b0; font-family: monospace; }
    .auth-badge {
      margin-left: auto;
      font-size: 0.65rem;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: rgba(108,99,255,0.15);
      color: #6c63ff;
      border: 1px solid rgba(108,99,255,0.2);
    }
    .footer {
      text-align: center;
      color: #6b6b80;
      font-size: 0.85rem;
      border-top: 1px solid #1e1e2e;
      padding-top: 1.5rem;
    }
    .footer a { color: #6c63ff; text-decoration: none; }
    .stats { display: flex; justify-content: center; gap: 3rem; margin-bottom: 2rem; }
    .stat { text-align: center; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #6c63ff; }
    .stat-label { font-size: 0.8rem; color: #6b6b80; margin-top: 0.2rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">&#x25cf; LIVE</div>
      <h1>Arnifi<span>Jobs</span> API</h1>
      <p class="subtitle">Full Stack Job Application REST API</p>
      <p class="version">v1.0.0 &nbsp;&bull;&nbsp; Node.js + Express &nbsp;&bull;&nbsp; PostgreSQL</p>
    </div>

    <div class="stats">
      <div class="stat"><div class="stat-value">8</div><div class="stat-label">Endpoints</div></div>
      <div class="stat"><div class="stat-value">3</div><div class="stat-label">Resources</div></div>
      <div class="stat"><div class="stat-value">JWT</div><div class="stat-label">Auth</div></div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Authentication</h3>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/api/auth/signup</span>
        </div>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/api/auth/login</span>
        </div>
      </div>

      <div class="card">
        <h3>Jobs</h3>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/api/jobs</span>
          <span class="auth-badge">JWT</span>
        </div>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/api/jobs</span>
          <span class="auth-badge">Admin</span>
        </div>
        <div class="endpoint">
          <span class="method put">PUT</span>
          <span class="path">/api/jobs/:id</span>
          <span class="auth-badge">Admin</span>
        </div>
        <div class="endpoint">
          <span class="method delete">DELETE</span>
          <span class="path">/api/jobs/:id</span>
          <span class="auth-badge">Admin</span>
        </div>
      </div>

      <div class="card">
        <h3>Applications</h3>
        <div class="endpoint">
          <span class="method post">POST</span>
          <span class="path">/api/jobs/:id/apply</span>
          <span class="auth-badge">User</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <span class="path">/api/applications</span>
          <span class="auth-badge">JWT</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Built by Keerthi &nbsp;&bull;&nbsp; Arnifi Internship Assignment &nbsp;&bull;&nbsp;
      <a href="https://github.com/Keerthi7903/arnifi-job-app" target="_blank">GitHub</a> &nbsp;&bull;&nbsp;
      <a href="https://arnifi-job-app-zts2.vercel.app" target="_blank">Frontend</a>
      </p>
    </div>
  </div>
</body>
</html>`);
});

const PORT = process.env.PORT || 5000;

initDB().then(function() {
  app.listen(PORT, function() {
    console.log("Server on " + PORT);
  });
}).catch(function(err) {
  console.error("Failed to start:", err.message);
});