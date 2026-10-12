# School Task Assignment

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-6.x-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/API-Django%20REST%20Framework-A30000)](https://www.django-rest-framework.org/)
[![Database](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Repository](https://img.shields.io/badge/Repository-GitHub-181717?logo=github&logoColor=white)](https://github.com/Habiba12390/School-Task-Assignment_updated)

A Django-based school task management platform for coordinating assignments between administrators and teachers. The system provides role-aware authentication, task creation and lifecycle management, teacher dashboards, administrator oversight, and a public contact experience through a server-rendered web interface and REST-style endpoints.

> **Repository status:** This README documents the current implementation in the `master` branch. No automated benchmark results, CI workflow, or open-source license are currently declared in the repository; therefore, performance and coverage figures are not fabricated here.

## Overview

School Task Assignment centralizes the creation, assignment, monitoring, and completion of school-related work. Administrators can create and review tasks assigned to teachers, while teachers can view their active workload, filter tasks by priority, and mark work as completed.

The application is organized as a modular Django project with separate apps for:

- **Accounts** — registration, login, logout, roles, and session state.
- **Tasks** — task data model, serialization, CRUD endpoints, and task pages.
- **Dashboard** — administrator and teacher dashboards plus role-specific actions.
- **Public** — home, about, contact pages, and contact-message submission.

## Key Features & Metrics

### Core features

- **Role-based access flow** for `admin` and `teacher` users.
- **Task CRUD API** for listing, creating, retrieving, updating, and deleting tasks.
- **Teacher workload management** with teacher-specific task filtering and priority filtering.
- **Completion workflow** allowing authenticated teachers to mark their assigned tasks as completed.
- **Administrator task oversight** with task retrieval and deletion endpoints.
- **Public contact form API** that validates and persists contact messages.
- **Django admin integration** for managing users and application data.

### Engineering metrics

The current repository does not include reproducible load-test, benchmark, or coverage reports. The measurable implementation scope is:

| Area | Current implementation |
| --- | --- |
| Backend framework | Django with Django REST Framework |
| Persistence | SQLite database via Django ORM |
| Domain applications | 4 Django apps: `accounts`, `tasks`, `dashboard`, and `public` |
| Task priorities | 3 levels: low, medium, and high |
| User roles | 2 roles: admin and teacher |
| Task operations | REST-style list/create plus detail retrieve/update/delete |
| Automated performance metrics | Not reported in the repository |
| Automated test coverage | Not reported in the repository |

For production adoption, add a benchmark suite, API load tests, and coverage reporting before publishing latency, throughput, or reliability claims.

## System Architecture

The project follows a **modular Django monolith** architecture:

```text
Browser / API Client
        |
        v
Django URL Router
        |
        +--> accounts  -> registration, login, sessions, logout
        +--> tasks     -> task CRUD API and task pages
        +--> dashboard -> role-specific dashboards and actions
        +--> public    -> public pages and contact submission
        |
        v
Django ORM
        |
        v
SQLite (db.sqlite3)
```

### Design principles

- **Separation of concerns:** domain responsibilities are split across Django apps instead of being concentrated in one module.
- **Convention over configuration:** Django routing, templates, migrations, ORM models, and admin integration provide the application foundation.
- **API serialization:** task payloads are represented through `TaskSerializer` using Django REST Framework.
- **Role-aware request handling:** dashboard views use session state to route users to the correct dashboard and restrict role-specific operations.
- **Incremental extensibility:** the current SQLite-backed design can be migrated to PostgreSQL or another supported database through Django settings and migrations.

### Data flow

1. A user registers or logs in through the accounts endpoints.
2. Django stores the user context in the session, including user ID, name, email, and role.
3. Administrators create or inspect tasks through the task API and dashboard views.
4. Teachers retrieve their active tasks, optionally filter by priority, and submit completion actions.
5. The ORM persists users, tasks, and contact messages in the configured database.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Language | Python | Application implementation |
| Web framework | Django | Routing, templates, sessions, ORM, migrations, and admin |
| API framework | Django REST Framework | Task serialization and REST-style endpoints |
| CORS | `django-cors-headers` | Cross-origin request handling |
| Database | SQLite | Local development persistence through `db.sqlite3` |
| Frontend | Django templates, HTML, CSS, JavaScript | Server-rendered pages and browser interactions |
| Static assets | Django staticfiles | Static file discovery and collection |

## Getting Started

### Prerequisites

- Python 3.x
- `pip`
- Git

The repository currently does not include a `requirements.txt` or `pyproject.toml`, so dependencies should be installed explicitly or captured in a project-specific dependency file before deployment.

### 1. Clone the repository

```bash
git clone https://github.com/Habiba12390/School-Task-Assignment_updated.git
cd School-Task-Assignment_updated
```

### 2. Create and activate a virtual environment

#### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
python -m pip install Django djangorestframework django-cors-headers
```

If the project is later provided with a dependency lock file, prefer that file for reproducible installation.

### 4. Configure local settings

The current development configuration uses SQLite and does not require environment variables to start locally. Before deploying, move sensitive and environment-specific values out of `backend/settings.py` and configure at least:

```dotenv
DJANGO_SECRET_KEY=replace-with-a-long-random-value
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

> **Security note:** Do not use the repository's current development secret key, unrestricted CORS configuration, plain-text password handling, or `DEBUG=True` configuration in production. Replace these with Django's secure password utilities, environment-managed secrets, restricted origins, and production settings.

### 5. Apply migrations

```bash
python manage.py migrate
```

### 6. Create an administrator account for Django admin (optional)

```bash
python manage.py createsuperuser
```

### 7. Start the development server

```bash
python manage.py runserver
```

The application is then available at:

- Public home page: `http://127.0.0.1:8000/`
- Login page: `http://127.0.0.1:8000/login/`
- Signup page: `http://127.0.0.1:8000/signup/`
- Django admin: `http://127.0.0.1:8000/admin/`

### 8. Collect static files when needed

```bash
python manage.py collectstatic
```

## Usage

### Register a user

Registration accepts `admin` and `teacher` roles and returns a role-specific redirect URL.

```bash
curl -X POST http://127.0.0.1:8000/signup-api/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher-one",
    "email": "teacher.one@gmail.com",
    "password": "change-me",
    "confirm_password": "change-me",
    "role": "teacher"
  }'
```

### Log in

```bash
curl -i -c cookies.txt -X POST http://127.0.0.1:8000/login-api/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher.one@gmail.com",
    "password": "change-me"
  }'
```

The session cookie can be reused with subsequent authenticated requests using `-b cookies.txt`.

### List tasks

```bash
curl http://127.0.0.1:8000/api/tasks/
```

### Create a task

```bash
curl -X POST http://127.0.0.1:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{
    "task_title": "Prepare science worksheet",
    "teacher_name": "teacher-one",
    "subject": "Science",
    "grade": "Grade 7",
    "priority": "high",
    "description": "Prepare and upload the worksheet for next week.",
    "created_by": "admin-one",
    "status": "Pending"
  }'
```

### Retrieve, update, or delete a task

Replace `1` with the task's `task_ID`:

```bash
# Retrieve
curl http://127.0.0.1:8000/api/tasks/1/

# Partially update
curl -X PUT http://127.0.0.1:8000/api/tasks/1/ \
  -H "Content-Type: application/json" \
  -d '{"priority": "medium", "status": "In Progress"}'

# Delete
curl -X DELETE http://127.0.0.1:8000/api/tasks/1/
```

### Dashboard routes

| Route | Purpose |
| --- | --- |
| `/api/dashboard/admin-dashboard/` | Administrator dashboard |
| `/api/dashboard/teacher-dashboard/` | Teacher dashboard |
| `/api/dashboard/api/admin-tasks/` | Fetch active tasks created by the authenticated administrator |
| `/api/dashboard/api/delete-task/<task_id>/` | Delete an administrator task |
| `/api/dashboard/teacher-complete/<task_id>/` | Mark a teacher task as completed with a POST request |

### Submit a contact message

```bash
curl -X POST http://127.0.0.1:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example User",
    "email": "example@gmail.com",
    "message": "I would like to learn more about the platform."
  }'
```

## Project Structure

```text
.
├── accounts/       # User model, authentication endpoints, and account pages
├── backend/        # Django project settings, URL configuration, and WSGI entry point
├── dashboard/      # Admin and teacher dashboards plus role-specific actions
├── public/         # Home, about, contact, and public contact API
├── tasks/          # Task model, serializer, CRUD API, and task pages
├── db.sqlite3      # Development database
├── manage.py       # Django management entry point
└── staticfiles/    # Collected static assets
```

## Testing and Quality Checks

The repository does not currently declare an automated test suite or CI workflow. Before opening a pull request, run the available Django validation commands and verify the main user flows manually:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

For future quality improvements, consider adding:

- Django unit and integration tests for authentication, permissions, task CRUD, and completion flows.
- API tests for validation errors and unauthorized requests.
- A pinned dependency file such as `requirements.txt` or `pyproject.toml`.
- Continuous integration for checks, migrations, tests, and security scanning.
- Coverage reporting and repeatable performance benchmarks.

## Contributing

Contributions are welcome and should keep the project maintainable and secure.

1. Fork the repository.
2. Create a focused branch:
   ```bash
   git checkout -b feature/your-change
   ```
3. Make the change and add or update tests where applicable.
4. Run Django checks and the test suite locally.
5. Commit with a clear, imperative message.
6. Push your branch and open a pull request describing the motivation, implementation, testing performed, and any follow-up work.

Please avoid committing secrets, generated local databases, virtual environments, or collected static files unless they are intentionally required by the project.

## License

No license file is currently included in this repository. Until a license is added, the project should be treated as **all rights reserved**. Add a `LICENSE` file—such as the MIT License—before granting permissions for reuse, modification, or redistribution.

## Maintainer

- **GitHub:** [Habiba12390](https://github.com/Habiba12390)
