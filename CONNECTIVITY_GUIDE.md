# Frontend-Backend Connectivity Guide

## Project Overview
Movie Collaboration System - A full-stack production management platform with React frontend and Flask backend.

---

## Architecture Summary

### Backend (Python/Flask)
- **Port**: 5000
- **Framework**: Flask with Flask-SocketIO
- **Database**: SQLite (local) + MongoDB (cloud)
- **Authentication**: JWT (Flask-JWT-Extended)

### Frontend (React/Vite)
- **Port**: 5173 (default Vite dev server)
- **API Base URL**: http://127.0.0.1:5000
- **Real-time Communication**: Socket.IO

---

## API Endpoints Connected

### Authentication Routes (`/backend/routes/auth.py`)

#### 1. Register User
```
POST /register
Body: { name, email, password, role }
Response: { message: "Registration Successful" }
Frontend: src/services/authService.js → registerUser()
UI: src/pages/Register.jsx
```

#### 2. Login User
```
POST /login
Body: { email, password }
Response: { message, token, role }
Frontend: src/services/authService.js → loginUser()
UI: src/pages/Login.jsx
Stores: token (localStorage), user object (localStorage)
```

### Project Routes (`/backend/routes/project.py`)

#### 3. Get All Projects
```
GET /projects
Headers: Authorization: Bearer {token}
Response: [{ id, title, description, director_id }]
Frontend: src/services/projectService.js → getProjects()
UI: src/pages/Projects.jsx
```

#### 4. Create Project
```
POST /create-project
Headers: Authorization: Bearer {token}
Body: { title, description }
Response: { message: "Project Created Successfully" }
Frontend: src/services/projectService.js → createProject()
Requires: Director role
```

#### 5. Assign Crew to Project
```
POST /assign-crew
Headers: Authorization: Bearer {token}
Body: { project_id, crew_id, crew_role }
Response: { message: "Crew Assigned Successfully" }
Frontend: src/services/projectService.js → assignCrew()
Requires: Director role
```

#### 6. Get Project Crew
```
GET /project-crew/<project_id>
Headers: Authorization: Bearer {token}
Response: [{ crew_id, crew_name, crew_role }]
Frontend: src/services/projectService.js → getProjectCrew()
```

### Dashboard Routes (`/backend/routes/dashboard.py`)

#### 7. Get Crew List
```
GET /crew
Response: [{ name, role, status }]
Frontend: src/services/dashboardService.js → getCrew()
UI: src/pages/Dashboard.jsx / Crew.jsx
```

#### 8. Get Schedules
```
GET /schedules
Response: [{ day, scene, time, location }]
Frontend: src/services/dashboardService.js → getSchedules()
UI: src/pages/Schedules.jsx
```

#### 9. Get Assets
```
GET /assets
Response: [{ title, type }]
Frontend: src/services/dashboardService.js → getAssets()
UI: src/pages/Assets.jsx
```

#### 10. Get Approvals
```
GET /approvals
Response: [{ id, title, status }]
Frontend: src/services/dashboardService.js → getApprovals()
UI: src/pages/Approvals.jsx
```

---

## Real-time Communication (Socket.IO)

### Socket Events

#### Client → Server

**1. User Join**
```javascript
socket.emit("join_user", { user: username })
```

**2. Send Message**
```javascript
socket.emit("send_message", { user: username, message: message_text })
```

**3. Send Notification**
```javascript
socket.emit("send_notification", { title, message })
```

#### Server → Client (Broadcasts)

**1. Online Users Update**
```javascript
socket.on("online_users", (users_list) => { ... })
```

**2. Receive Message**
```javascript
socket.on("receive_message", (message_data) => { ... })
```

**3. Receive Notification**
```javascript
socket.on("receive_notification", (notification_data) => { ... })
```

### Implementation
- **Backend**: `/backend/socket_events.py`
- **Frontend**: `/frontend/src/pages/Chat.jsx`
- **Storage**: MongoDB (messages, notifications collections)

---

## API Service Layer

### Frontend Service Files

#### `src/services/api.js`
Central axios instance with:
- Base URL: `http://127.0.0.1:5000`
- JWT token injection in all request headers
- Error handling interceptors

```javascript
// Auto-adds Authorization header
const token = localStorage.getItem("token");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

#### `src/services/authService.js`
- `loginUser(data)` - POST /login
- `registerUser(data)` - POST /register
- `logoutUser()` - Clear tokens

#### `src/services/projectService.js`
- `getProjects()` - GET /projects
- `createProject(data)` - POST /create-project
- `assignCrew(data)` - POST /assign-crew
- `getProjectCrew(projectId)` - GET /project-crew/:id

#### `src/services/dashboardService.js`
- `getCrew()` - GET /crew
- `getSchedules()` - GET /schedules
- `getAssets()` - GET /assets
- `getApprovals()` - GET /approvals

---

## Data Flow

### Authentication Flow
```
User enters credentials
    ↓
Login.jsx calls loginUser()
    ↓
API.post("/login", credentials)
    ↓
Backend validates → returns token + role
    ↓
Store token in localStorage
    ↓
Redirect to /dashboard
    ↓
All subsequent requests include Authorization header
```

### Project Fetch Flow
```
Dashboard/Projects page mounts
    ↓
useEffect triggers fetchProjects()
    ↓
projectService.getProjects()
    ↓
API.get("/projects") with token in header
    ↓
Backend returns projects array
    ↓
Component renders project list
```

### Real-time Chat Flow
```
Chat.jsx mounts
    ↓
Socket connects to http://127.0.0.1:5000
    ↓
Emit "join_user" with username
    ↓
User sends message
    ↓
Emit "send_message" with user + message
    ↓
Backend broadcasts via "receive_message"
    ↓
All connected clients receive message
    ↓
MongoDB stores message
```

---

## Database Models

### SQLite Models (`models.py`)
- **User**: id, name, email, password, role
- **Project**: id, title, description, director_id
- **CrewAssignment**: id, project_id, crew_id, crew_role
- **Schedule**: id, project_id, title, location, shoot_date, start_time, end_time, description
- **Task**: id, project_id, assigned_to, title, description, status
- **Budget**: id, project_id, category, amount, description
- **Attendance**: id, crew_id, project_id, date, status
- **Scene**: id, project_id, scene_number, title, location, description, status

### MongoDB Collections
- **messages**: { user, message, _id, timestamp }
- **notifications**: { title, message, _id, timestamp }

---

## CORS Configuration

**Current Setup (Development)**
```python
CORS(app, cors_allowed_origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")
```

⚠️ **Note**: Allow all origins for development. For production, specify allowed domains.

---

## Running the Application

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Server runs on http://127.0.0.1:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://127.0.0.1:5173
```

---

## Common Issues & Solutions

### Issue 1: "Unauthorized" errors on API calls
**Solution**: Ensure token is in localStorage and API.js includes Authorization header

### Issue 2: Socket connection fails
**Solution**: Verify backend is running on 5000 and CORS allows Socket.IO connections

### Issue 3: Login shows "Invalid password" even with correct credentials
**Solution**: Check MongoDB connection and ensure user exists in database

### Issue 4: Cross-origin requests blocked
**Solution**: Verify CORS is enabled in backend (currently set to allow all origins)

### Issue 5: Projects don't load on Projects page
**Solution**: 
- Verify `/projects` endpoint is hit (not `/test-projects`)
- Check JWT token is valid
- Verify database has project data

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://movieadmin:12345@moviecollabapp.d1tnzti.mongodb.net/?appName=moviecollabapp
JWT_SECRET_KEY=your_jwt_secret_key_here
SQLALCHEMY_DATABASE_URI=sqlite:///database.db
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://127.0.0.1:5000
VITE_SOCKET_IO_URL=http://127.0.0.1:5000
```

---

## Testing Endpoints

### Using Thunder Client / Postman

**1. Register**
```
POST http://127.0.0.1:5000/register
Content-Type: application/json

{
  "name": "John Director",
  "email": "john@example.com",
  "password": "password123",
  "role": "Director"
}
```

**2. Login**
```
POST http://127.0.0.1:5000/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
Response includes: token, role
```

**3. Get Projects** (Requires Token)
```
GET http://127.0.0.1:5000/projects
Authorization: Bearer {token_from_login}
```

---

## Summary of Changes Made

✅ Fixed authService to use correct response fields
✅ Fixed projectService endpoint from `/test-projects` → `/projects`
✅ Updated Login.jsx to store JWT token and user role
✅ Connected Register.jsx to backend API with proper validation
✅ Added JWT token to all API requests via interceptor
✅ Fixed Chat.jsx Socket.IO setup and event handling
✅ Added Vite proxy configuration for development
✅ Created .env.example files for configuration
✅ Verified all models exist in backend

---

## Quick Checklist

- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:5173
- [ ] Database initialized (SQLite + MongoDB)
- [ ] Token stored after login
- [ ] Projects load on Projects page
- [ ] Chat connects via Socket.IO
- [ ] Can create/assign crew to projects
- [ ] Dashboard shows analytics

---

## Next Steps

1. Test all endpoints with Postman/Thunder Client
2. Verify database connectivity (SQL + Mongo)
3. Test Socket.IO in Chat page
4. Add error boundaries in React components
5. Implement refresh token mechanism
6. Add request/response logging for debugging
7. Set up production deployment configuration
