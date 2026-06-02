from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# USER TABLE
class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(100), unique=True, nullable=False)

    password = db.Column(db.String(200), nullable=False)

    role = db.Column(db.String(50), nullable=False)


# PROJECT TABLE
class Project(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)

    description = db.Column(db.String(500))

    director_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )


# CREW ASSIGNMENT TABLE
class CrewAssignment(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    crew_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )

    crew_role = db.Column(db.String(100))
# PRODUCTION SCHEDULE MODEL
class Schedule(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    title = db.Column(db.String(200))

    location = db.Column(db.String(200))

    shoot_date = db.Column(db.String(100))

    start_time = db.Column(db.String(100))

    end_time = db.Column(db.String(100))

    description = db.Column(db.Text)
    # TASK MODEL
class Task(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )

    title = db.Column(db.String(200))

    description = db.Column(db.Text)

    status = db.Column(db.String(100), default="Pending")
    # BUDGET MODEL
class Budget(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    category = db.Column(db.String(200))

    amount = db.Column(db.Float)

    description = db.Column(db.Text)
    # ATTENDANCE MODEL
class Attendance(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    crew_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    date = db.Column(db.String(100))

    status = db.Column(db.String(100))
    # SCENE MODEL
class Scene(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    scene_number = db.Column(db.String(100))

    title = db.Column(db.String(200))

    location = db.Column(db.String(200))

    description = db.Column(db.Text)

    status = db.Column(
        db.String(100),
        default="Pending"
    )