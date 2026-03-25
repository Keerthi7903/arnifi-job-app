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
  res.json({
    name: "Arnifi Jobs API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: {
        signup: "POST /api/auth/signup",
        login: "POST /api/auth/login"
      },
      jobs: {
        getAll: "GET /api/jobs",
        create: "POST /api/jobs",
        update: "PUT /api/jobs/:id",
        delete: "DELETE /api/jobs/:id",
        apply: "POST /api/jobs/:id/apply"
      },
      applications: {
        getMyApplications: "GET /api/applications"
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

initDB().then(function() {
  app.listen(PORT, function() {
    console.log("Server on " + PORT);
  });
}).catch(function(err) {
  console.error("Failed to start:", err.message);
});