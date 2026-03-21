# WORKLOG

## Time Tracking

Target time: **2 hours 30 minutes**  
Actual time spent: **2 hours 43 minutes**

I challenged myself to complete the take-home task within 2 hours and 30 minutes. I went slightly over that target and completed the implementation in 2 hours and 43 minutes.

## Completed

- Set up MySQL with Docker Compose
- Added automatic database initialization through `init.sql`
- Implemented `GET /api/projects` to read project data from CSV
- Implemented CSV + MySQL comment merge using `project_code`
- Implemented `PUT /api/projects/:project_code/comment` for comment persistence
- Used upsert strategy for comment write-back
- Built frontend project dashboard
- Built project detail page with comment editing
- Connected frontend to backend APIs
- Added pagination using `limit` and `offset`
- Added comment suggestion helper endpoint
- Added fallback/stub behavior for suggestion when no LLM API configuration is present
- Prepared README and AI disclosure documentation

## Future Improvements

- Move the CSV source out of the codebase and fetch it from a managed storage location such as AWS S3 for better maintainability and a more realistic production-style data flow.
- Add login authentication and protected routes instead of keeping the login page as a UI-only screen.
- Add CSV upload/import capability as an optional extension to the current read-from-file approach.

## Not Completed

- Automated test/smoke script

## Final Status

**Completed**