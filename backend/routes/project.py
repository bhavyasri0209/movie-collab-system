from flask import Blueprint, request, jsonify
from models import Attendance
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from models import Scene
from models import db
from models import Project
from models import User
from models import CrewAssignment
from models import Schedule
from models import Task

import os

from werkzeug.utils import secure_filename

import extensions

from bson.objectid import ObjectId

from sqlalchemy import func
from models import Budget

project = Blueprint('project', __name__)

# ======================================================
# CREATE PROJECT
# ======================================================

@project.route('/create-project', methods=['POST'])
@jwt_required()
def create_project():

    current_user = get_jwt_identity()

    claims = get_jwt()

    role = claims.get("role")

    if role != "Director":

        return jsonify({
            "message": "Access Denied"
        }), 403

    data = request.json

    new_project = Project(
        title=data['title'],
        description=data['description'],
        director_id=current_user
    )

    db.session.add(new_project)

    db.session.commit()

    return jsonify({
        "message": "Project Created Successfully"
    })

# ======================================================
# GET ALL PROJECTS
# ======================================================

@project.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():

    projects = Project.query.all()

    result = []

    for p in projects:

        result.append({

            "id": p.id,
            "title": p.title,
            "description": p.description,
            "director_id": p.director_id
        })

    return jsonify(result)

# ======================================================
# ASSIGN CREW
# ======================================================

@project.route('/assign-crew', methods=['POST'])
@jwt_required()
def assign_crew():

    claims = get_jwt()

    role = claims.get("role")

    # DIRECTOR ONLY
    if role != "Director":

        return jsonify({
            "message": "Only Director Can Assign Crew"
        }), 403

    data = request.json

    # CHECK USER EXISTS
    crew_user = User.query.get(data['crew_id'])

    if not crew_user:

        return jsonify({
            "message": "Crew User Not Found"
        }), 404

    assignment = CrewAssignment(

        project_id=data['project_id'],

        crew_id=data['crew_id'],

        crew_role=data['crew_role']
    )

    db.session.add(assignment)

    db.session.commit()

    return jsonify({
        "message": "Crew Assigned Successfully"
    })

# ======================================================
# GET PROJECT CREW
# ======================================================

@project.route('/project-crew/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_crew(project_id):

    assignments = CrewAssignment.query.filter_by(
        project_id=project_id
    ).all()

    result = []

    for a in assignments:

        crew = User.query.get(a.crew_id)

        result.append({

            "crew_id": crew.id,

            "crew_name": crew.name,

            "crew_email": crew.email,

            "crew_role": a.crew_role
        })

    return jsonify(result)

# ======================================================
# UPLOAD ASSET
# ======================================================

@project.route('/upload-asset', methods=['POST'])
@jwt_required()
def upload_asset():

    # CHECK FILE
    if 'file' not in request.files:

        return jsonify({
            "message": "No File Found"
        }), 400

    file = request.files['file']

    # SAFE FILE NAME
    filename = secure_filename(file.filename)

    # FILE PATH
    filepath = os.path.join("uploads", filename)

    # SAVE FILE
    file.save(filepath)

    # STORE METADATA IN MONGODB
    extensions.mongo_db.assets.insert_one({

        "filename": filename,

        "filepath": filepath
    })

    return jsonify({

        "message": "File Uploaded Successfully",

        "filename": filename
    })

# ======================================================
# GET ALL ASSETS
# ======================================================

@project.route('/assets', methods=['GET'])
@jwt_required()
def get_assets():

    assets = extensions.mongo_db.assets.find()

    result = []

    for asset in assets:

        result.append({

            "id": str(asset['_id']),

            "filename": asset['filename'],

            "filepath": asset['filepath']
        })

    return jsonify(result)

# ======================================================
# DELETE ASSET
# ======================================================

@project.route('/delete-asset/<asset_id>', methods=['DELETE'])
@jwt_required()
def delete_asset(asset_id):

    asset = extensions.mongo_db.assets.find_one({

        "_id": ObjectId(asset_id)
    })

    # CHECK ASSET EXISTS
    if not asset:

        return jsonify({
            "message": "Asset Not Found"
        }), 404

    # DELETE LOCAL FILE
    if os.path.exists(asset['filepath']):

        os.remove(asset['filepath'])

    # DELETE FROM MONGODB
    extensions.mongo_db.assets.delete_one({

        "_id": ObjectId(asset_id)
    })

    return jsonify({
        "message": "Asset Deleted Successfully"
    })

# ======================================================
# CREATE SHOOT SCHEDULE
# ======================================================

@project.route('/create-schedule', methods=['POST'])
@jwt_required()
def create_schedule():

    claims = get_jwt()

    role = claims.get("role")

    # DIRECTOR ONLY
    if role != "Director":

        return jsonify({
            "message": "Only Director Can Create Schedule"
        }), 403

    data = request.json

    schedule = Schedule(

        project_id=data['project_id'],

        title=data['title'],

        location=data['location'],

        shoot_date=data['shoot_date'],

        start_time=data['start_time'],

        end_time=data['end_time'],

        description=data['description']
    )

    db.session.add(schedule)

    db.session.commit()

    return jsonify({
        "message": "Schedule Created Successfully"
    })

# ======================================================
# GET PROJECT SCHEDULES
# ======================================================

@project.route('/schedules/<int:project_id>', methods=['GET'])
@jwt_required()
def get_schedules(project_id):

    schedules = Schedule.query.filter_by(
        project_id=project_id
    ).all()

    result = []

    for s in schedules:

        result.append({

            "id": s.id,

            "title": s.title,

            "location": s.location,

            "shoot_date": s.shoot_date,

            "start_time": s.start_time,

            "end_time": s.end_time,

            "description": s.description
        })

    return jsonify(result)

# ======================================================
# ASSIGN TASK
# ======================================================

@project.route('/assign-task', methods=['POST'])
@jwt_required()
def assign_task():

    claims = get_jwt()

    role = claims.get("role")

    # DIRECTOR ONLY
    if role != "Director":

        return jsonify({
            "message": "Only Director Can Assign Tasks"
        }), 403

    data = request.json

    task = Task(

        project_id=data['project_id'],

        assigned_to=data['assigned_to'],

        title=data['title'],

        description=data['description']
    )

    db.session.add(task)

    db.session.commit()

    return jsonify({
        "message": "Task Assigned Successfully"
    })

# ======================================================
# GET CREW TASKS
# ======================================================

@project.route('/my-tasks/<int:user_id>', methods=['GET'])
@jwt_required()
def get_tasks(user_id):

    tasks = Task.query.filter_by(
        assigned_to=user_id
    ).all()

    result = []

    for t in tasks:

        result.append({

            "id": t.id,

            "project_id": t.project_id,

            "title": t.title,

            "description": t.description,

            "status": t.status
        })

    return jsonify(result)

# ======================================================
# UPDATE TASK STATUS
# ======================================================

@project.route('/update-task/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):

    task = Task.query.get(task_id)

    if not task:

        return jsonify({
            "message": "Task Not Found"
        }), 404

    data = request.json

    task.status = data['status']

    db.session.commit()

    return jsonify({
        "message": "Task Updated Successfully"
    })

# ======================================================
# DIRECTOR DASHBOARD
# ======================================================

@project.route('/director-dashboard', methods=['GET'])
@jwt_required()
def director_dashboard():

    claims = get_jwt()

    role = claims.get("role")

    # DIRECTOR ONLY
    if role != "Director":

        return jsonify({
            "message": "Access Denied"
        }), 403

    # TOTAL PROJECTS
    total_projects = Project.query.count()

    # TOTAL CREW ASSIGNMENTS
    total_crew = CrewAssignment.query.count()

    # TOTAL TASKS
    total_tasks = Task.query.count()

    # COMPLETED TASKS
    completed_tasks = Task.query.filter_by(
        status="Completed"
    ).count()

    # TOTAL SCHEDULES
    total_schedules = Schedule.query.count()

    # TOTAL ASSETS
    total_assets = extensions.mongo_db.assets.count_documents({})

    return jsonify({

        "total_projects": total_projects,

        "total_crew_members": total_crew,

        "total_tasks": total_tasks,

        "completed_tasks": completed_tasks,

        "total_schedules": total_schedules,

        "total_assets": total_assets
    })
# ======================================================
# CREW DASHBOARD
# ======================================================

@project.route('/crew-dashboard/<int:user_id>', methods=['GET'])
@jwt_required()
def crew_dashboard(user_id):

    # GET USER TASKS
    tasks = Task.query.filter_by(
        assigned_to=user_id
    ).all()

    total_tasks = len(tasks)

    pending_tasks = 0

    completed_tasks = 0

    for task in tasks:

        if task.status == "Completed":

            completed_tasks += 1

        else:

            pending_tasks += 1

    # GET SCHEDULES COUNT
    total_schedules = Schedule.query.count()

    return jsonify({

        "total_tasks": total_tasks,

        "pending_tasks": pending_tasks,

        "completed_tasks": completed_tasks,

        "total_schedules": total_schedules
    })
# ======================================================
# ADD BUDGET ENTRY
# ======================================================

@project.route('/add-budget', methods=['POST'])
@jwt_required()
def add_budget():

    claims = get_jwt()

    role = claims.get("role")

    if role != "Director":

        return jsonify({
            "message": "Only Director Can Add Budget"
        }), 403

    data = request.json

    budget = Budget(

        project_id=data['project_id'],

        category=data['category'],

        amount=data['amount'],

        description=data['description']
    )

    db.session.add(budget)

    db.session.commit()

    return jsonify({
        "message": "Budget Added Successfully"
    })
# ======================================================
# GET PROJECT BUDGET
# ======================================================

@project.route('/budget/<int:project_id>', methods=['GET'])
@jwt_required()
def get_budget(project_id):

    budgets = Budget.query.filter_by(
        project_id=project_id
    ).all()

    result = []

    total = 0

    for b in budgets:

        total += b.amount

        result.append({

            "id": b.id,

            "category": b.category,

            "amount": b.amount,

            "description": b.description
        })

    return jsonify({

        "total_budget": total,

        "expenses": result
    })
# ======================================================
# MARK ATTENDANCE
# ======================================================

@project.route('/mark-attendance', methods=['POST'])
@jwt_required()
def mark_attendance():

    data = request.json

    attendance = Attendance(

        crew_id=data['crew_id'],

        project_id=data['project_id'],

        date=data['date'],

        status=data['status']
    )

    db.session.add(attendance)

    db.session.commit()

    return jsonify({
        "message": "Attendance Marked Successfully"
    })
# ======================================================
# GET ATTENDANCE
# ======================================================

@project.route('/attendance/<int:project_id>', methods=['GET'])
@jwt_required()
def get_attendance(project_id):

    records = Attendance.query.filter_by(
        project_id=project_id
    ).all()

    result = []

    for r in records:

        crew = User.query.get(r.crew_id)

        result.append({

            "crew_name": crew.name,

            "date": r.date,

            "status": r.status
        })

    return jsonify(result)
# ======================================================
# CREATE SCENE
# ======================================================

@project.route('/create-scene', methods=['POST'])
@jwt_required()
def create_scene():

    claims = get_jwt()

    role = claims.get("role")

    if role != "Director":

        return jsonify({
            "message": "Only Director Can Create Scenes"
        }), 403

    data = request.json

    scene = Scene(

        project_id=data['project_id'],

        scene_number=data['scene_number'],

        title=data['title'],

        location=data['location'],

        description=data['description']
    )

    db.session.add(scene)

    db.session.commit()

    return jsonify({
        "message": "Scene Created Successfully"
    })
# ======================================================
# GET PROJECT SCENES
# ======================================================

@project.route('/scenes/<int:project_id>', methods=['GET'])
@jwt_required()
def get_scenes(project_id):

    scenes = Scene.query.filter_by(
        project_id=project_id
    ).all()

    result = []

    for s in scenes:

        result.append({

            "id": s.id,

            "scene_number": s.scene_number,

            "title": s.title,

            "location": s.location,

            "description": s.description,

            "status": s.status
        })

    return jsonify(result)
# ======================================================
# UPDATE SCENE STATUS
# ======================================================

@project.route('/update-scene/<int:scene_id>', methods=['PUT'])
@jwt_required()
def update_scene(scene_id):

    scene = Scene.query.get(scene_id)

    if not scene:

        return jsonify({
            "message": "Scene Not Found"
        }), 404

    data = request.json

    scene.status = data['status']

    db.session.commit()

    return jsonify({
        "message": "Scene Updated Successfully"
    })
