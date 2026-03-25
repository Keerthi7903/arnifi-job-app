require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));

app.get("/", (_, res) => res.send("Arnifi API running"));

const PORT = process.env.PORT || 5000;
initDB().then(() => app.listen(PORT, () => console.log(`Server on ${PORT}`)));