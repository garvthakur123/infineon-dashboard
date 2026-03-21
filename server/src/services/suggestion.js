const { readProjectsFromCsv } = require("./csv");

function buildFallback(project) {
  const status = String(project.status).toLowerCase();
  const lastMilestone = project.last_milestone;
  const nextMilestone = project.next_milestone;
  const resourceBookings = project.resource_bookings;

  if (status === "red") {
    return `Project needs attention. Last milestone was ${lastMilestone}, next focus is ${nextMilestone}, and ${resourceBookings} should be reviewed.`;
  }

  if (status === "yellow") {
    return `Project is progressing with some risk. Last milestone was ${lastMilestone}, next step is ${nextMilestone}, and ${resourceBookings} should be monitored closely.`;
  }

  return `Project is progressing as expected. Last milestone was ${lastMilestone}, next focus is ${nextMilestone}, and ${resourceBookings} look aligned.`;
}

async function generateSuggestion(projectCode) {
  const projects = await readProjectsFromCsv();
  const project = projects.find((p) => p.project_code === projectCode);

  if (!process.env.LLM_API_KEY || !process.env.LLM_MODEL || !process.env.LLM_API_URL) {
    return buildFallback(project);
  }

  const response = await fetch(process.env.LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages: [
        {
          role: "system",
          content: "Write one short, professional project comment suggestion. Return only the comment.",
        },
        {
          role: "user",
          content: [
            `Project Code: ${project.project_code}`,
            `Project Name: ${project.project_name}`,
            `Project Lead: ${project.project_lead_name}`,
            `Status: ${project.status}`,
            `Last Milestone: ${project.last_milestone || ""}`,
            `Next Milestone: ${project.next_milestone || ""}`,
            `Resource Bookings: ${project.resource_bookings || ""}`,
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    return buildFallback(project);
  }

  const data = await response.json();

  return data.choices?.[0]?.message?.content?.trim() || buildFallback(project);
}

module.exports = { generateSuggestion };