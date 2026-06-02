from flask import Flask, render_template

from flask_cors import CORS

from flask_jwt_extended import JWTManager

from flask_socketio import SocketIO

from pymongo import MongoClient

from config import Config

from models import db

import extensions

from routes.auth import auth
from routes.project import project
from routes.dashboard import dashboard

from socket_events import register_socket_events


app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

jwt = JWTManager(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

register_socket_events(socketio)

mongo_client = MongoClient(
    app.config["MONGO_URI"]
)

extensions.mongo_db = mongo_client[
    "movie_production_db"
]

print("MongoDB Connected Successfully 🚀")

with app.app_context():

    db.create_all()

app.register_blueprint(auth)

app.register_blueprint(project)

app.register_blueprint(dashboard)


@app.route("/")
def home():

    return {
        "message": "Movie Production Backend Running 🚀"
    }


@app.route("/login-page")
def login_page():

    return render_template(
        "login.html"
    )


@app.route("/register-page")
def register_page():

    return render_template(
        "register.html"
    )


@app.route("/chat")
def chat():

    return render_template(
        "chat.html"
    )


@app.route("/director-dashboard-page")
def director_dashboard_page():

    return render_template(
        "director_dashboard.html"
    )


@app.route("/tasks-page")
def tasks_page():

    return render_template(
        "tasks.html"
    )


@app.route("/kanban")
def kanban_page():

    return render_template(
        "kanban.html"
    )


@app.route("/calendar")
def calendar_page():

    return render_template(
        "calendar.html"
    )


@app.route("/ai-assistant")
def ai_assistant():

    return render_template(
        "ai_assistant.html"
    )


@app.route("/analytics")
def analytics_page():

    return render_template(
        "analytics.html"
    )


@app.route("/scene-management")
def scene_management():

    return render_template(
        "scene_management.html"
    )


@app.route("/budget-dashboard")
def budget_dashboard():

    return render_template(
        "budget_dashboard.html"
    )


if __name__ == "__main__":

   socketio.run(
    app,
    host="0.0.0.0",
    port=5000,
    debug=False,
    allow_unsafe_werkzeug=True
)