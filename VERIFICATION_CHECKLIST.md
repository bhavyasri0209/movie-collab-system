# Verification & Testing Checklist

## Prerequisites ✅ Check

- [ ] Backend Python venv created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend npm dependencies installed (`npm install`)
- [ ] MongoDB connection available (check MONGO_URI)
- [ ] SQLite database path writable

---

## Backend Startup ✅

```bash
cd backend
source venv/Scripts/activate  # Windows
python app.py
```

Expected output:
```
MongoDB Connected Successfully 🚀
 * Running on http://127.0.0.1:5000
```

- [ ] Backend running on localhost:5000
- [ ] MongoDB connection successful
- [ ] No error messages in terminal

---

## Frontend Startup ✅

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.4.2  ready in XXX ms
➜  Local:   http://127.0.0.1:5173/
```

- [ ] Frontend running on localhost:5173
- [ ] No console errors in browser DevTools

---

## Authentication Testing ✅

### Register Flow
1. [ ] Navigate to http://localhost:5173/register
2. [ ] Fill form with:
   - Name: "Test Director"
   - Email: "test@example.com"
   - Password: "test123"
   - Role: "Director"
3. [ ] Click "Create Account"
4. [ ] See success message
5. [ ] Redirected to login page after 2 seconds
6. [ ] Check backend terminal for user creation

### Login Flow
1. [ ] Navigate to http://localhost:5173/login
2. [ ] Enter credentials:
   - Email: "test@example.com"
   - Password: "test123"
3. [ ] Click "Access Production"
4. [ ] Redirected to /dashboard
5. [ ] Open DevTools → Application → localStorage
   - [ ] Token exists and is a valid JWT
   - [ ] User object has role: "Director"

---

## API Connectivity Testing ✅

### Projects Endpoint
1. [ ] Navigate to http://localhost:5173/projects
2. [ ] Page loads with "Loading Productions..." initially
3. [ ] Projects array displays (even if empty)
4. [ ] DevTools Network tab shows:
   - [ ] GET request to http://localhost:5000/projects
   - [ ] Status: 200
   - [ ] Authorization header present
   - [ ] Response has token validation

### Dashboard Data
1. [ ] On Dashboard page, verify all cards display:
   - [ ] Crew Management
   - [ ] Production Timeline
   - [ ] Shoot Scheduling
   - [ ] Location Tracking
   - [ ] Notifications
   - [ ] Media Assets

### Network Tab Verification
For each API call, verify:
- [ ] Request has `Authorization: Bearer {token}` header
- [ ] Content-Type is application/json
- [ ] Response status is 200 or appropriate error code
- [ ] Response body is valid JSON

---

## Real-time Communication Testing ✅

### Socket.IO Connection
1. [ ] Navigate to http://localhost:5173/chat
2. [ ] DevTools Console should show:
   - [ ] "Connected to chat server"
   - [ ] No connection errors
3. [ ] See "● Online" status indicator
4. [ ] Input field is enabled

### Send Message
1. [ ] Type message: "Hello Production"
2. [ ] Click Send or Press Enter
3. [ ] Message appears in chat window
4. [ ] Check DevTools Console:
   - [ ] "Message received: ..." appears
5. [ ] Backend terminal shows message stored

### Socket Error Handling
1. [ ] Disconnect backend server
2. [ ] Chat status changes to "● Offline"
3. [ ] Input field is disabled
4. [ ] Restart backend
5. [ ] Chat auto-reconnects
6. [ ] Status changes to "● Online"

---

## API Endpoint Testing (Postman/Thunder Client) ✅

### Test without Token

**Register**
```
POST http://localhost:5000/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Director"
}
```

Expected: 200 OK
```json
{
  "message": "Registration Successful"
}
```

- [ ] Returns success message

**Login**
```
POST http://localhost:5000/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Expected: 200 OK
```json
{
  "message": "Login Successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "role": "Director"
}
```

- [ ] Returns valid JWT token
- [ ] Returns role "Director"
- [ ] Copy token for next tests

---

### Test with Token

**Get Projects**
```
GET http://localhost:5000/projects
Authorization: Bearer {token_from_login}
```

Expected: 200 OK
```json
[
  {
    "id": 1,
    "title": "Project Name",
    "description": "...",
    "director_id": 1
  }
]
```

- [ ] Returns array of projects
- [ ] Authorization header accepted

**Get Crew**
```
GET http://localhost:5000/crew
```

Expected: 200 OK
```json
[
  {
    "name": "Christopher Nolan",
    "role": "Director",
    "status": "Active"
  }
]
```

- [ ] Returns crew members

**Get Schedules**
```
GET http://localhost:5000/schedules
```

Expected: 200 OK
```json
[
  {
    "day": "Monday",
    "scene": "Scene 12",
    "time": "08:00 AM",
    "location": "Iceland Studio"
  }
]
```

- [ ] Returns schedules

**Create Project** (Director only)
```
POST http://localhost:5000/create-project
Authorization: Bearer {token_from_login}
Content-Type: application/json

{
  "title": "New Movie",
  "description": "Epic action film"
}
```

Expected: 200 OK
```json
{
  "message": "Project Created Successfully"
}
```

- [ ] Project created successfully

---

## Browser DevTools Testing ✅

### Console
- [ ] No red error messages
- [ ] No warnings about CORS
- [ ] Socket connection messages appear

### Network Tab
- [ ] All API calls have status 200 or expected error codes
- [ ] No failed requests (red entries)
- [ ] Authorization headers present
- [ ] MIME types correct (application/json)

### Application → Local Storage
- [ ] `token` key contains JWT string
- [ ] `user` key contains role information
- [ ] Both persist across page refreshes

### Application → Cookies
- [ ] No unexpected cookies
- [ ] Session management clean

---

## Error Scenarios Testing ✅

### Invalid Credentials
1. [ ] Login with wrong password
2. [ ] See error: "Invalid email or password"
3. [ ] Stays on login page
4. [ ] No token created

### Missing JWT Token
1. [ ] Manually delete token from localStorage
2. [ ] Try to access /projects
3. [ ] Request fails with 401 Unauthorized
4. [ ] See appropriate error handling

### Network Failure
1. [ ] Stop backend server
2. [ ] Try to login
3. [ ] See network error message
4. [ ] Can still see pages but API calls fail
5. [ ] Start backend
6. [ ] Retry succeeds

---

## Performance Checks ✅

- [ ] Login completes in < 1 second
- [ ] Projects page loads in < 2 seconds
- [ ] Chat messages send in < 500ms
- [ ] No memory leaks (DevTools Performance tab)
- [ ] Socket reconnection within 5 seconds

---

## Cross-browser Testing ✅

- [ ] Chrome/Edge - Works correctly
- [ ] Firefox - Works correctly
- [ ] Safari - Works correctly (if on Mac)

---

## Security Checks ✅

- [ ] JWT token is not exposed in URLs
- [ ] Token stored only in localStorage (not cookies for sensitive data)
- [ ] No sensitive data in console logs
- [ ] CORS allows localhost development
- [ ] API returns appropriate error codes (401, 403, 404, 500)

---

## Final Verification ✅

User Experience Flow:
1. [ ] User visits http://localhost:5173
2. [ ] Home page displays
3. [ ] Can navigate to Register
4. [ ] Register → Login → Dashboard flow works
5. [ ] All pages in sidebar navigation work
6. [ ] Projects page shows data from backend
7. [ ] Chat connects via Socket.IO
8. [ ] Can send/receive messages
9. [ ] Logout clears token
10. [ ] Logged out user redirected to login

---

## Issues Found & Resolution

| Issue | Status | Resolution |
|-------|--------|-----------|
| Token not stored | ✅ Fixed | Added localStorage.setItem in Login.jsx |
| Wrong endpoint called | ✅ Fixed | Changed /test-projects to /projects |
| Missing auth header | ✅ Fixed | Added JWT interceptor in api.js |
| Register not working | ✅ Fixed | Implemented full Register.jsx integration |
| Chat socket issues | ✅ Fixed | Added reconnection logic and error handling |

---

## Sign-Off ✅

- [ ] All items above verified and working
- [ ] No console errors
- [ ] All API endpoints responding correctly
- [ ] Real-time communication working
- [ ] Production ready for next phase

**Tested By:** _______________  
**Date:** _______________  
**Status:** ✅ READY TO DEPLOY

---

## Next Steps

1. **Development**
   - Continue building additional features
   - Add more API endpoints as needed
   - Enhance UI/UX

2. **Testing**
   - Unit tests for services
   - Integration tests for API flows
   - E2E tests with Playwright

3. **Deployment**
   - Set up environment variables
   - Configure production database
   - Deploy backend to server
   - Deploy frontend to CDN/hosting

4. **Monitoring**
   - Set up error tracking
   - Monitor API performance
   - Track user engagement
