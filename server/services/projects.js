const pool = require("../db/pool");
const { readProjectsFromCsv } = require("./csv");

async function getProjects() {
  const projects = await readProjectsFromCsv();
  const [comments] = await pool.query(
    "SELECT project_code, comment FROM project_comments"
  );

  const commentMap = new Map(
    comments.map((row) => [row.project_code, row.comment])
  );

  return projects.map((project) => ({
    ...project,
    comment: commentMap.get(project.project_code) ?? project.comment,
  }));
}

async function saveComment(projectCode, comment) {
  await pool.query(
    `
      INSERT INTO project_comments (project_code, comment)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE comment = VALUES(comment)
    `,
    [projectCode, comment]
  );
}

module.exports = { getProjects, saveComment };