# Project Manager - Project Management Tool

Project Manager is a full-stack project management web application built to help teams organize and track their work. It includes authentication, role-based access control, task tracking, and team management capabilities.

## Features

- **Authentication**: Secure signup and login using JWT.
- **Projects**: Create, update, and delete projects.
- **Team Management**: Add or remove members and assign them roles (Admin or Member).
- **Task Tracking**: Create tasks, set priorities, assign due dates, and update statuses (To Do, In Progress, Done). Tasks can also include specific requirements.
- **Dashboard**: Get a quick overview of all tasks, view status breakdowns, and track overdue items.
- **Role-Based Access Control**:
  - **Admin**: Has full permissions to manage projects, tasks, and team members.
  - **Member**: Can view project details and update the status of tasks specifically assigned to them.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT and bcrypt
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Deployment**: Railway

## Setup

### Prerequisites
- Node.js v18 or higher
- A PostgreSQL database (local or cloud-hosted)

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd ProjectManager

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit the .env file and add your DATABASE_URL and JWT_SECRET

# Push the database schema
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Start the development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key used for JWT signing |
| `PORT` | Server port (defaults to 3000) |

## Deployment

This application is configured for deployment on Railway.

1. Push your code to GitHub.
2. Create a new project on Railway.
3. Add a PostgreSQL database service.
4. Add a Web Service pointing to your GitHub repository.
5. Set the required environment variables (`DATABASE_URL` and `JWT_SECRET`) in the Railway dashboard.
6. Railway will automatically build and deploy the application. The start script is configured to run database migrations automatically.

## Project Structure

```
ProjectManager/
├── prisma/schema.prisma     # Database schema definition
├── src/
│   ├── index.js             # Express server entry point
│   ├── config/db.js         # Prisma client initialization
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication logic
│   │   └── rbac.js          # Role-based access control logic
│   ├── routes/              # API route definitions
│   └── controllers/         # Application business logic
├── public/                  # Frontend static files
│   ├── index.html           # Login and Signup pages
│   ├── dashboard.html       # User dashboard
│   ├── projects.html        # Projects listing
│   ├── project.html         # Individual project view and tasks
│   ├── css/style.css        # Global styles
│   └── js/api.js            # Frontend API utilities
├── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get current user details

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - List projects for the authenticated user
- `GET /api/projects/:id` - Get details for a specific project
- `PUT /api/projects/:id` - Update a project (Admin only)
- `DELETE /api/projects/:id` - Delete a project (Admin only)

### Members
- `POST /api/projects/:id/members` - Add a member to a project (Admin only)
- `DELETE /api/projects/:id/members/:memberId` - Remove a member (Admin only)

### Tasks
- `POST /api/projects/:id/tasks` - Create a new task (Admin only)
- `GET /api/projects/:id/tasks` - List tasks for a project
- `PUT /api/projects/:id/tasks/:taskId` - Update a task
- `DELETE /api/projects/:id/tasks/:taskId` - Delete a task (Admin only)

### Dashboard
- `GET /api/dashboard` - Get aggregated user statistics

## Live Application

The application is deployed and accessible at:
https://project-management-production-c370.up.railway.app/

## License

MIT
