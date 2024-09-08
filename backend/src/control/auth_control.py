from bson.errors import InvalidId
from flask import jsonify, request, session
from src import app
from src.model.user_model import get_user_by_id, is_valid_objectid


@app.route("/api/auth/check/<string:user_id>", methods=["GET"])
def check_auth(user_id):
    try:
        if not is_valid_objectid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400

        user = get_user_by_id(user_id)
        if user:
            return jsonify({"isAuthenticated": True, "user": str(user["_id"])})

        return jsonify({"isAuthenticated": False}), 401

    except InvalidId:
        return jsonify({"error": "Invalid user ID format"}), 400


# Assuming you have an endpoint for login where you set the session
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    user_id = data.get("user_id")
    if is_valid_objectid(user_id) and get_user_by_id(user_id):
        session["user_id"] = user_id
        return jsonify({"message": "Login successful", "user": user_id}), 200
    return jsonify({"error": "Invalid credentials"}), 401
