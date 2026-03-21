const { getProjects, saveComment } = require("../services/projects");
const { generateSuggestion } = require("../services/suggestion");

async function getAllProjects(req, res) {
  try {
    const projects = await getProjects();
    const { limit, offset, search, status } = req.query;

    if (limit === undefined && offset === undefined) {
      return res.json(projects);
    }

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOffset = parseInt(offset, 10) || 0;
    const statuses = [...new Set(projects.map((p) => p.status))].sort();

    let filtered = projects;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.project_name.toLowerCase().includes(q) ||
          p.project_lead_name.toLowerCase().includes(q) ||
          p.project_code.toLowerCase().includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    const total = filtered.length;
    const items = filtered.slice(parsedOffset, parsedOffset + parsedLimit);

    res.json({ items, total, limit: parsedLimit, offset: parsedOffset, statuses });
  } catch {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
}

async function updateComment(req, res) {
  const { project_code } = req.params;
  const { comment } = req.body;

  if (typeof comment !== "string" || !comment.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }
  if (comment.length > 500) {
    return res.status(400).json({ message: "Comment exceeds 500 characters" });
  }

  try {
    await saveComment(project_code, comment);
    res.json({ message: "Comment saved" });
  } catch {
    res.status(500).json({ message: "Failed to save comment" });
  }
}

async function getCommentSuggestion(req, res) {
  try {
    const suggestion = await generateSuggestion(req.params.project_code);
    res.json({ suggestion });
  } catch {
    res.status(500).json({ message: "Failed to generate suggestion" });
  }
}

module.exports = { getAllProjects, updateComment, getCommentSuggestion };
