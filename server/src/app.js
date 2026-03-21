const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const projectsRoutes = require("./routes/projects");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/projects", projectsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));