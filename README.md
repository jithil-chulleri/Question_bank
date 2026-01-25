# Question Bank Application

A full-stack question bank application built with React, FastAPI, and PostgreSQL, running in Docker containers.

## 🚀 Quick Start

```bash
# Start the application
./run.sh
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔐 Default Credentials

**Admin Account**:
- Email: `admin@questionbank.com`
- Password: `admin123`

## 📋 Features

- ✅ User authentication (signup/login with JWT)
- ✅ Browse and answer multiple-choice questions
- ✅ Instant color-coded feedback (green for correct, red for incorrect)
- ✅ Admin panel for adding/managing questions
- ✅ Persistent data storage with PostgreSQL
- ✅ Modern, responsive UI with dark theme

## 🏗️ Architecture

- **Frontend**: React + Vite + Nginx (Port 80)
- **Backend**: FastAPI + Python (Port 8000)
- **Database**: PostgreSQL 15 (Port 5432)

All services run in Docker containers orchestrated by Docker Compose.

## 📦 Prerequisites

- Docker
- Docker Compose (v2 or v1)

## 🛠️ Development

### Start the application
```bash
./run.sh
```

### View logs
```bash
docker compose logs -f
```

### Stop the application
```bash
docker compose down
```

### Rebuild after code changes
```bash
docker compose build
docker compose up -d
```

### Remove all data (including database)
```bash
docker compose down -v
```

## 📁 Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # Authentication
│   │   ├── database.py     # Database connection
│   │   └── routers/        # API endpoints
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/
│   └── init.sql           # Database initialization
├── docker-compose.yml     # Container orchestration
├── run.sh                 # Deployment script
└── .env                   # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Questions (User)
- `GET /api/questions` - Get all questions
- `POST /api/questions/{id}/answer` - Submit answer

### Admin
- `POST /api/admin/questions` - Add new question
- `GET /api/admin/questions` - Get all questions (with answers)
- `DELETE /api/admin/questions/{id}` - Delete question

## 🎨 UI Features

- Modern dark theme with glassmorphism effects
- Vibrant gradient colors
- Smooth animations and transitions
- Responsive grid layout
- Interactive question cards
- Instant visual feedback

## 🔒 Security

- JWT-based authentication
- Bcrypt password hashing
- Protected routes
- Admin-only endpoints
- CORS configuration

## ⚠️ Production Deployment

Before deploying to production:

1. Change `SECRET_KEY` in `.env`
2. Update admin password
3. Configure proper CORS origins
4. Set up HTTPS/SSL
5. Configure database backups
6. Use production-grade secrets management

## 📝 License

This project is provided as-is for educational purposes.
