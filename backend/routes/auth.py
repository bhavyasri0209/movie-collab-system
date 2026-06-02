from flask import Blueprint, request, jsonify

from models import db, User

from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

from flask_jwt_extended import create_access_token

auth = Blueprint('auth', __name__)

# REGISTER
@auth.route('/register', methods=['POST'])
def register():

    data = request.json

    # CHECK USER EXISTS
    existing_user = User.query.filter_by(email=data['email']).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    # HASH PASSWORD
    hashed_password = generate_password_hash(data['password'])

    # CREATE USER
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data['role']
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration Successful"
    })


# LOGIN
@auth.route('/login', methods=['POST'])
def login():

    data = request.json

    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    # VERIFY PASSWORD
    if not check_password_hash(user.password, data['password']):
        return jsonify({
            "message": "Invalid password"
        }), 401

    # CREATE JWT TOKEN
    token = create_access_token(
    identity=str(user.id),
    additional_claims={
        "role": user.role
    }
)

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "role": user.role
    })