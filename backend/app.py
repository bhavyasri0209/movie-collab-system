from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO, emit
from pymongo import MongoClient

from config import Config
from models import db
import extensions
from routes.auth import auth
from routes.project import project

from routes.dashboard import dashboard
from socket_events import register_socket_events

# Create Flask app FIRST


import extensions

from socket_events import register_socket_events


app = Flask(__name__)

# Then configure it
CORS(app)
app.config.from_object(Config)


# Initialize extensions

# ======================================================
# DATABASE
# ======================================================

# SQLAlchemy
db.init_app(app)
jwt = JWTManager(app)

socketio = SocketIO(app, cors_allowed_origins="*")
register_socket_events(socketio)

# MongoDB
mongo_client = MongoClient(app.config['MONGO_URI'])
extensions.mongo_db = mongo_client['movie_production_db']
print("MongoDB Connected Successfully 🚀")

socketio = SocketIO(
    app,
    cors_allowed_origins="*"
)

register_socket_events(socketio)

# MongoDB
mongo_client = MongoClient(
    app.config['MONGO_URI']
)

extensions.mongo_db = mongo_client[
    'movie_production_db'
]

print("MongoDB Connected Successfully 🚀")

# ======================================================
# CREATE TABLES
# ======================================================

with app.app_context():

    db.create_all()

# ======================================================
# REGISTER BLUEPRINTS
# ======================================================

app.register_blueprint(auth)

app.register_blueprint(project)
app.register_blueprint(dashboard)

# START SERVER
if __name__ == "__main__":
    socketio.run(app, host='127.0.0.1', port=5000, debug=True)
# ======================================================
# FRONTEND ROUTES
# ======================================================

# LANDING PAGE
@app.route('/')
def home():

    return render_template(
        'landing.html'
    )

# LOGIN PAGE
@app.route('/login-page')
def login_page():

    return render_template(
        'login.html'
    )

# REGISTER PAGE
@app.route('/register-page')
def register_page():

    return render_template(
        'register.html'
    )

# CHAT PAGE
@app.route('/chat')
def chat():

    return render_template(
        'chat.html'
    )

# DIRECTOR DASHBOARD
@app.route('/director-dashboard-page')
def director_dashboard_page():

    return render_template(
        'director_dashboard.html'
    )

# TASK PAGE
@app.route('/tasks-page')
def tasks_page():

    return render_template(
        'tasks.html'
    )

# KANBAN BOARD
@app.route('/kanban')
def kanban_page():

    return render_template(
        'kanban.html'
    )

# CALENDAR PAGE
@app.route('/calendar')
def calendar_page():

    return render_template(
        'calendar.html'
    )

# AI ASSISTANT
@app.route('/ai-assistant')
def ai_assistant():

    return render_template(
        'ai_assistant.html'
    )

# ANALYTICS PAGE
@app.route('/analytics')
def analytics_page():

    return render_template(
        'analytics.html'
    )

# SCENE MANAGEMENT
@app.route('/scene-management')
def scene_management():

    return render_template(
        'scene_management.html'
    )

# BUDGET DASHBOARD
@app.route('/budget-dashboard')
def budget_dashboard():

    return render_template(
        'budget_dashboard.html'
    )

# ======================================================
# RUN SERVER
# ======================================================

if __name__ == "__main__":

    socketio.run(
        app,
        debug=True
    )
