# Quick Troubleshooting Guide

## 🚀 Starting the Application

### Step 1: Start Backend
```bash
cd backend
source venv/Scripts/activate  # Windows: venv\Scripts\activate
python app.py
```

✅ Expected: `MongoDB Connected Successfully 🚀`  
✅ Server: `http://127.0.0.1:5000`

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

✅ Expected: `Local: http://127.0.0.1:5173/`

---

## ❌ Common Problems & Fixes

### Problem 1: Backend Won't Start

**Error:** `ModuleNotFoundError: No module named 'flask'`
```bash
# Solution: Install dependencies
cd backend
pip install -r requirements.txt
```

**Error:** `Port 5000 already in use`
```bash
# Solution: Kill the process on port 5000
# Windows: netstat -ano | findstr :5000
# Then: taskkill /PID <PID> /F

# Or change port in app.py:
# socketio.run(app, host='127.0.0.1', port=5001)
```

**Error:** `MongoDB connection failed`
```bash
# Solution: Check MongoDB URI in backend/config.py
# Make sure:
# 1. MongoDB cluster is active
# 2. IP is whitelisted in MongoDB
# 3. Connection string is correct
```

### Problem 2: Frontend Won't Start

**Error:** `npm ERR! code ERESOLVE`
```bash
# Solution: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Error:** `Port 5173 already in use`
```bash
# Solution: Vite will use next available port
# Or kill the process:
# Windows: netstat -ano | findstr :5173
# Then: taskkill /PID <PID> /F
```

### Problem 3: "Cannot GET /"

**In Browser:** Access http://localhost:5173  
**Not:** http://localhost:5000

Frontend runs on **5173**, Backend API on **5000**

### Problem 4: Login Says "Invalid Email or Password"

**Check 1:** Did you register first?
- Go to http://localhost:5173/register
- Create an account
- Then try login

**Check 2:** Verify credentials in console
```javascript
// Open DevTools → Console
localStorage.getItem('token')  // Should show JWT after login
localStorage.getItem('user')   // Should show {"role":"..."}
```

**Check 3:** Check backend terminal for errors
```
# Look for exceptions when login attempted
```

### Problem 5: Projects Page Shows "Loading..." Forever

**Check Network Tab:**
1. Open DevTools (F12) → Network tab
2. Look for GET request to `/projects`
3. Check response:
   - Status should be 200
   - Response should be JSON array
   - Authorization header should present

**If 401 Unauthorized:**
- Token not sent
- Token expired
- Backend JWT config wrong

**Solution:**
```javascript
// Check localStorage in console
localStorage.getItem('token')  // Must exist

// Check if Authorization header sent
// DevTools → Network → Click request → Headers tab
// Look for: Authorization: Bearer {token}
```

### Problem 6: Chat Won't Connect

**Check 1:** Is backend running?
```bash
# Test: curl http://localhost:5000
# Should respond (not connection refused)
```

**Check 2:** Socket.IO logs in browser
```javascript
// DevTools → Console
// Look for: "Connected to chat server" or "Connection error"
```

**Check 3:** Check Socket.IO endpoint
```javascript
// frontend/src/pages/Chat.jsx line ~16
// Should be: io("http://127.0.0.1:5000")
```

### Problem 7: Can't Send Chat Messages

**Check 1:** Are you connected?
- Look for "● Online" status
- If offline, connection failed

**Check 2:** Try typing and pressing Enter
- Or click Send button
- Check console for errors

**Check 3:** Verify backend socket event handler
```bash
# backend/socket_events.py should have:
# @socketio.on('send_message')
# def handle_message(data):
```

### Problem 8: Getting CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Check 1:** Verify backend CORS is enabled
```python
# backend/app.py line ~16
CORS(app)  # Should be present
```

**Check 2:** Verify frontend URL matches
```javascript
// frontend/src/services/api.js
baseURL: "http://127.0.0.1:5000"  // Correct URL
```

**Check 3:** Try disabling browser extensions
- Ad blockers sometimes block requests

### Problem 9: Database Not Found

**Error:** `sqlite:///database.db not found`

**Solution:** Database creates automatically on first run
- If permissions denied, check folder write access
- Try running: `python app.py` once to create database

### Problem 10: Socket.IO Not Broadcasting

**Problem:** Send message but others don't receive

**Check Backend:** 
```bash
# Terminal should show:
# "Message received:" or similar

# If not showing:
# 1. Message not reaching backend
# 2. Socket event name mismatch
```

**Check Frontend:**
```javascript
// Should emit: socket.emit("send_message", ...)
// Should listen: socket.on("receive_message", ...)
```

**Check Backend:**
```python
# socket_events.py should have:
# @socketio.on('send_message')
# emit('receive_message', data, broadcast=True)
```

---

## 🔍 Debug Checklist

### Browser DevTools (F12)

**Console Tab:**
```javascript
// Check for errors (red messages)
// Check for warnings (yellow messages)

// Test commands:
localStorage.getItem('token')  // Should exist after login
localStorage.getItem('user')   // Should have role
```

**Network Tab:**
```
// Monitor API requests
// Look for:
// - Red entries (failed requests)
// - Authorization headers present
// - Response status codes
```

**Application Tab → LocalStorage:**
```
// Check stored data
token: (should be long JWT string)
user: (should have role info)
```

**Console Network Simulation:**
```javascript
// Simulate offline to test error handling
// DevTools → Network tab → Throttling dropdown
// Select "Offline"
```

### Backend Terminal

**Normal Output:**
```
MongoDB Connected Successfully 🚀
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

**With Requests:**
```
User Connected
127.0.0.1 - - [date] "POST /login HTTP/1.1" 200
```

**Look for Errors:**
```
Traceback (most recent call last):
  File "app.py", line X
    SyntaxError: ...
```

---

## 📝 Testing Endpoints with Postman

### Test 1: Register
```
Method: POST
URL: http://localhost:5000/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "Director"
}

Expected: 200 OK
```

### Test 2: Login
```
Method: POST
URL: http://localhost:5000/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}

Expected: 200 OK
Response: { "token": "...", "role": "Director", "message": "..." }

Copy the token for next tests!
```

### Test 3: Get Projects (Protected)
```
Method: GET
URL: http://localhost:5000/projects
Headers:
  Authorization: Bearer {token_from_login}

Expected: 200 OK
Response: []  (empty array if no projects)
```

### Test 4: Test Socket.IO
```javascript
// In browser console:
const socket = io('http://127.0.0.1:5000');

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('join_user', { user: 'TestUser' });
});

socket.on('receive_message', (data) => {
  console.log('Message:', data);
});

// Send a message:
socket.emit('send_message', {
  user: 'TestUser',
  message: 'Hello'
});
```

---

## 🔧 Advanced Troubleshooting

### Enable Verbose Logging

**Backend:**
```python
# backend/app.py
app.logger.setLevel(logging.DEBUG)
```

**Frontend:**
```javascript
// frontend/src/services/api.js
API.interceptors.request.use((config) => {
  console.log('API Request:', config);
  return config;
});
```

### Check Environment Variables

**Backend:**
```bash
# Verify .env file exists
echo $MONGO_URI
echo $JWT_SECRET_KEY
```

**Frontend:**
```bash
# Check .env exists
cat frontend/.env
```

### Database Inspection

**SQLite:**
```bash
# Install sqlite3
sqlite3 backend/instance/database.db

# List tables
.tables

# Check users
SELECT * FROM user;
```

**MongoDB:**
```javascript
// Use MongoDB Compass or shell
db.messages.find()
db.notifications.find()
```

---

## 📞 Still Having Issues?

### Gather Debug Info

Collect this information:
1. **Error message** (exact text)
2. **Where it occurred** (which page/action)
3. **Browser console errors** (screenshot)
4. **Backend terminal output** (screenshot)
5. **Network tab requests** (screenshot)

### Common File Locations

**Backend Config:**
- `backend/config.py` - Database and JWT settings
- `backend/app.py` - Flask app initialization
- `backend/requirements.txt` - Python dependencies

**Frontend Config:**
- `frontend/vite.config.js` - Build configuration
- `frontend/src/services/api.js` - API setup
- `frontend/package.json` - Node dependencies

**Documentation:**
- `CONNECTIVITY_GUIDE.md` - API reference
- `CHANGES_SUMMARY.md` - What was changed
- `VERIFICATION_CHECKLIST.md` - Testing guide
- `README.md` - Project overview

---

## 🎯 Quick Restart

If everything is broken, try this:

```bash
# 1. Kill all processes
# Windows: Press Ctrl+C in both terminals

# 2. Clear cache
cd frontend
npm cache clean --force

# 3. Clear database (CAUTION: loses data)
rm backend/instance/database.db

# 4. Restart everything
cd backend
python app.py

# In new terminal:
cd frontend
npm run dev
```

---

## ✅ Healthy System Checklist

**If All These Are True, System is Healthy:**
- [ ] Backend runs without errors
- [ ] Frontend loads without console errors
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] Token appears in localStorage after login
- [ ] Projects page shows data (or empty list)
- [ ] Chat connects and shows "Online"
- [ ] Can send and receive chat messages
- [ ] No red errors in DevTools Console
- [ ] Network requests show 200 status

---

**Last Updated:** June 2, 2026  
**For More Help:** See CONNECTIVITY_GUIDE.md
