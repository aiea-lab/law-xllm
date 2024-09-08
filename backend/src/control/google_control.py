import os

# import requests as requests_lib
from flask import jsonify, request
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import bcrypt
from bson import ObjectId
from src import app, mongo

BCRYPT_SALT_ROUNDS = 12

@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    token = request.json.get("token")
    if not token:
        return jsonify({"error": "Token is missing"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID")
        )

        # Get user info
        google_user_id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo.get("name", "")

        user = mongo.db.users.find_one({"google_user_id": google_user_id})
        if user:
            return (
                jsonify(
                    {"message": "User already exists", "user_id": str(user["_id"])}
                ),
                200,
            )

        # Create a new user
        user_id = mongo.db.users.insert_one(
            {"google_user_id": google_user_id, "email": email, "name": name}
        ).inserted_id

        return jsonify({"message": "User created", "user_id": str(user_id)}), 201

    except ValueError:
        return jsonify({"error": "Invalid token"}), 400

@app.route("/api/auth/register", methods=["POST"])
def register_user():
    data = request.json
    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required"}), 400

    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already in use"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt(BCRYPT_SALT_ROUNDS))
    user_id = mongo.db.users.insert_one({
        "email": data["email"],
        "password": hashed_password
    }).inserted_id
    return jsonify({"message": "User registered", "id": str(user_id)}), 201

@app.route("/api/auth/login", methods=["POST"])
def login_user():
    data = request.json
    if "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": data["email"]})
    if user and bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]):
        return jsonify({"message": "Login successful", "user": {"id": str(user["_id"]), "email": user["email"]}}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/auth/user/<string:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        data = request.json
        if "email" not in data:
            return jsonify({"error": "Email is required"}), 400

        result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"email": data["email"]}})
        if result.matched_count:
            return jsonify({"message": "User updated"})
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400