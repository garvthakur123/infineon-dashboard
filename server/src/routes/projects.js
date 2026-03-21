const express = require("express");
const { getAllProjects, updateComment, getCommentSuggestion } = require("../controllers/projects");

const router = express.Router();

router.get("/", getAllProjects);
router.put("/:project_code/comment", updateComment);
router.post("/:project_code/comment-suggestion", getCommentSuggestion);

module.exports = router;