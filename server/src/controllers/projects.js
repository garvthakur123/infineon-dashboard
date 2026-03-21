const { getProjects, saveComment } = require("../services/projects");

async function getAllProjects(req, res) {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
}

async function updateComment(req, res) {
  const { project_code } = req.params;
  const { comment } = req.body;

  try {
    await saveComment(project_code, comment);
    res.json({ message: "Comment saved" });
  } catch {
    res.status(500).json({ message: "Failed to save comment" });
  }
}

module.exports = { getAllProjects, updateComment };