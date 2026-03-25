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
  res.send("Arnifi API running");
});

const PORT = process.env.PORT || 5000;

initDB().then(function() {
  app.listen(PORT, function() {
    console.log("Server on " + PORT);
  });
}).catch(function(err) {
  console.error("Failed to start:", err.message);
});