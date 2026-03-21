# Infineon Project Dashboard Challenge

A small full-stack POC for viewing projects from a CSV file, editing project comments, and persisting those comments in MySQL.
Hosted Link: vercel.com/garvthakur123s-projects

## Features

- Read projects from CSV via `GET /api/projects`
- Persist edited comments in MySQL via `PUT /api/projects/:project_code/comment`
- Merge CSV data with persisted DB comments
- Project dashboard UI
- Project detail page for editing comments
- Pagination with `limit` and `offset`
- Login page included as an additional UI page (no authentication)

---

## Tech Stack

### Frontend
- React
- Vite

### Backend
- Node.js
- Express
- MySQL
- Docker Compose

---

## Project Structure

```text
infineon-private/
├── client/
├── server/
├── README.md
├── WORKLOG.md
└── AI_DISCLOSURE.md
```

---

## Setup

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- A CSV file with project data (placed at `server/data/projects.csv`)

### 1. Start MySQL

```bash
cd server
docker compose up -d
```

This starts a MySQL 8.0 container on port **3307** and runs `init.sql` to create the required tables.

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if you changed any database credentials in `docker-compose.yml`. The defaults work out of the box.

### 3. Install dependencies & start backend

```bash
npm install
npm start
```

The server starts on `http://localhost:4000`.

### 4. Install dependencies & start frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` and proxies `/api` requests to the backend.

---

## API Examples

### Get all projects (paginated)

```bash
curl "http://localhost:4000/api/projects?limit=10&offset=0"
```

Response:

```json
{
  "items": [{ "project_code": "P001", "project_name": "...", "status": "green", "budget": "50000", "comment": "..." }],
  "total": 42,
  "limit": 10,
  "offset": 0,
  "statuses": ["green", "red", "yellow"]
}
```

### Get all projects (no pagination)

```bash
curl "http://localhost:4000/api/projects"
```

Returns the full array of merged projects.

### Save a comment

```bash
curl -X PUT "http://localhost:4000/api/projects/P001/comment" \
  -H "Content-Type: application/json" \
  -d '{"comment": "On track for Q3 delivery."}'
```

Response:

```json
{ "message": "Comment saved" }
```

### Get a comment suggestion

```bash
curl -X POST "http://localhost:4000/api/projects/P001/comment-suggestion"
```

Response:

```json
{ "suggestion": "Project is progressing as expected..." }
```
