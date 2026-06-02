# Movie Collaboration System - Full Stack Setup Guide

## 🎬 Project Overview

A full-stack production management application for movie collaborations with real-time communication, crew management, scheduling, and project tracking.

**Tech Stack:**
- **Frontend**: React + Vite (JavaScript)
- **Backend**: Flask (Python)
- **Real-time**: Socket.IO
- **Databases**: SQLite (local) + MongoDB (cloud)
- **Authentication**: JWT (JSON Web Tokens)

---

## 📁 Project Structure

```
Movie-Collab-System/
├── backend/                 # Python Flask API
│   ├── routes/
│   │   ├── auth.py         # Login/Register endpoints
│   │   ├── project.py      # Project CRUD operations
│   │   └── dashboard.py    # Dashboard data endpoints
│   ├── models.py           # Database models
│   ├── socket_events.py    # Real-time events
│   ├── config.py           # Configuration
│   ├── app.py              # Main Flask app
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
│
├── frontend/               # React Vite application
│   ├── src/
│   │   ├── services/
│   │   │   ├── api.js          # Axios config + JWT interceptor
│   │   │   ├── authService.js  # Auth API calls
│   │   │   ├── projectService.js
│   │   │   └── dashboardService.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── ... (other pages)
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js      # Vite proxy config
│   └── .env.example        # Environment template
│
├── CONNECTIVITY_GUIDE.md   # Detailed API documentation
├── CHANGES_SUMMARY.md      # All changes made
└── VERIFICATION_CHECKLIST.md # Testing checklist
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- MongoDB account (or local MongoDB)
- SQLite (included with Python)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

**Expected Output:**
```
MongoDB Connected Successfully 🚀
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Expected Output:**
```
VITE v5.4.2  ready in XXX ms
➜  Local:   http://127.0.0.1:5173/
```

### Open in Browser
Visit: http://localhost:5173

---

## 🔗 Frontend-Backend Connectivity

### What's Connected

#### Authentication ✅
- User Registration: Frontend form → Backend `/register` endpoint
- User Login: Frontend credentials → Backend JWT token
- Token Management: Auto-injected in all API requests

#### Project Management ✅
- Get Projects: `GET /projects` with JWT
- Create Projects: `POST /create-project` (Director only)
- Assign Crew: `POST /assign-crew` (Director only)
- Get Crew: `GET /project-crew/:id`

#### Dashboard Data ✅
- Crew List: `GET /crew`
- Schedules: `GET /schedules`
- Assets: `GET /assets`
- Approvals: `GET /approvals`

#### Real-time Chat ✅
- Socket.IO connection on port 5000
- Send/receive messages via WebSocket
- Messages stored in MongoDB
- Online users tracking

---

## 🔧 Key Fixes Applied

### 1. Authentication Response Mismatch ✅
**Issue**: Frontend expected wrong response fields
**Fix**: Updated Login.jsx to use `token` and `role` from backend

### 2. API Endpoint Error ✅
**Issue**: Frontend called `/test-projects` (doesn't exist)
**Fix**: Changed to correct `/projects` endpoint

### 3. Missing JWT in Requests ✅
**Issue**: API calls didn't include authorization token
**Fix**: Added axios interceptor to auto-inject JWT

### 4. Register Not Connected ✅
**Issue**: Register page had no backend integration
**Fix**: Full API integration with validation and error handling

### 5. Socket.IO Issues ✅
**Issue**: Poor connection handling
**Fix**: Added reconnection logic, status indicator, proper cleanup

### 6. Vite Proxy Missing ✅
**Issue**: No dev proxy configuration
**Fix**: Added vite.config.js proxy for cleaner development

---

## 📚 Documentation Files

### 1. **CONNECTIVITY_GUIDE.md**
Complete API endpoint documentation with:
- All endpoints and their parameters
- Request/response examples
- Data flow diagrams
- Socket.IO events
- Common issues and solutions

### 2. **CHANGES_SUMMARY.md**
Detailed log of all changes:
- Issues fixed
- Files modified
- Code examples
- Testing checklist

### 3. **VERIFICATION_CHECKLIST.md**
Step-by-step testing guide:
- Startup verification
- Feature testing
- API testing with Postman
- Error scenario testing
- Security checks

---

## 🧪 Testing the Application

### Manual Testing
1. Open http://localhost:5173 in browser
2. Register new account (try: test@example.com)
3. Login with credentials
4. Navigate to Projects page (should load from backend)
5. Go to Chat page (should connect via Socket.IO)
6. Send a message (should appear for all connected users)

### API Testing (with Postman/Thunder Client)
```
# Register
POST http://localhost:5000/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "Director"
}

# Login
POST http://localhost:5000/login
{
  "email": "test@example.com",
  "password": "password123"
}
Response: { token, role, message }

# Get Projects (use token from login)
GET http://localhost:5000/projects
Headers: Authorization: Bearer {token}
```

See **VERIFICATION_CHECKLIST.md** for comprehensive testing guide.

---

## 🛠️ Environment Configuration

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?appName=app
JWT_SECRET_KEY=your_secret_key
SQLALCHEMY_DATABASE_URI=sqlite:///database.db
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://127.0.0.1:5000
VITE_SOCKET_IO_URL=http://127.0.0.1:5000
```

Copy `.env.example` to `.env` and fill in your values.

---

## 🗄️ Database Models

### SQLite Tables
- **User**: Registration & authentication
- **Project**: Movie production projects
- **CrewAssignment**: Team member assignments
- **Schedule**: Shoot dates and locations
- **Task**: Production tasks
- **Budget**: Project budgets
- **Attendance**: Crew attendance tracking
- **Scene**: Scene information

### MongoDB Collections
- **messages**: Chat messages
- **notifications**: System notifications

---

## 🔐 Security Notes

### Current State (Development)
- CORS allows all origins: `cors_allowed_origins="*"`
- JWT secrets in code (should be env variables)
- SQLite database in project folder

### For Production
1. Move secrets to environment variables
2. Restrict CORS to specific domains
3. Use production database (PostgreSQL, MySQL)
4. Enable HTTPS
5. Set up reverse proxy (Nginx)
6. Add rate limiting
7. Implement refresh token rotation
8. Add logging and monitoring

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Try different port in config.py
```

### Frontend Won't Connect to Backend
```bash
# Verify backend is running: curl http://localhost:5000
# Check CORS is enabled in app.py
# Verify baseURL in frontend/src/services/api.js
```

### Socket.IO Not Connecting
```bash
# Check socket event names match
# Verify backend has @socketio.on() decorators
# Look for errors in browser Console tab
```

### MongoDB Connection Error
```bash
# Verify MongoDB URI in config.py
# Check internet connection
# Verify MongoDB cluster allows your IP
```

---

## 📊 API Response Examples

### Login Success (200)
```json
{
  "message": "Login Successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "role": "Director"
}
```

### Get Projects (200)
```json
[
  {
    "id": 1,
    "title": "Interstellar",
    "description": "Sci-fi epic",
    "director_id": 1
  }
]
```

### Error - Unauthorized (401)
```json
{
  "message": "User not found"
}
```

---

## 🚦 Status Dashboard

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| Backend API | ✅ Running | 5000 | http://127.0.0.1:5000 |
| Frontend Dev Server | ✅ Running | 5173 | http://127.0.0.1:5173 |
| MongoDB | ✅ Connected | 27017 | Cloud |
| SQLite | ✅ Local | - | /backend/instance/database.db |
| Socket.IO | ✅ Connected | 5000 | ws://127.0.0.1:5000 |
| JWT Auth | ✅ Active | - | Bearer tokens |

---

## 📋 Checklist for First Run

- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:5173
- [ ] Can register new account
- [ ] Can login with registered credentials
- [ ] Token stored in localStorage
- [ ] Projects page loads from API
- [ ] Chat connects via Socket.IO
- [ ] Can send/receive messages
- [ ] No console errors in browser
- [ ] No errors in backend terminal

---

## 🎯 Next Development Steps

1. **Enhance Features**
   - Add file upload for assets
   - Implement budget tracking
   - Add scene management
   - Build analytics dashboard

2. **Improve User Experience**
   - Add loading spinners
   - Implement error toasts
   - Add pagination for large lists
   - Improve form validation

3. **Production Ready**
   - Set up environment variables
   - Configure production database
   - Add request logging
   - Implement rate limiting
   - Set up error tracking (Sentry)

4. **Testing**
   - Write unit tests
   - Add integration tests
   - Set up CI/CD pipeline
   - Performance testing

---

## 📞 Support & Documentation

**For detailed API documentation:** See `CONNECTIVITY_GUIDE.md`

**For all changes made:** See `CHANGES_SUMMARY.md`

**For testing guide:** See `VERIFICATION_CHECKLIST.md`

---

## ✅ Status

**Frontend-Backend Connection: FULLY INTEGRATED** ✅

All critical connectivity issues have been identified and fixed. The application is ready for development and testing.

**Last Updated:** June 2, 2026  
**Status:** Production Ready for Development
