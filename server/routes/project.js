const express = require("express");
const { getAllProjects, updateComment } = require("../controllers/projects");

const router = express.Router();

router.get("/", getAllProjects);

router.put("/:project_code/comment", updateComment);

module.exports = router;