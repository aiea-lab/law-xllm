from bson.errors import InvalidId
from flask import jsonify, request
from src import app, mongo

from src.model.conversation_model import (
    delete_conversation_by_id,
    get_all_conversations,
    is_valid_objectid,
    update_conversation_by_id,
    get_conversation,
)

from src.model.openai_model import (
    call_openai_api
)

@app.route("/conversation", methods=["POST"])
def add_conversation_route():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid input"}), 400
        conversation_id = mongo.db.conversations.insert_one(data).inserted_id

        return (
            jsonify({"message": "Conversation added", "id": str(conversation_id)}),
            201,
        )
    except InvalidId:
        return jsonify({"error": "Invalid ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/conversation/all", methods=["GET"])
def get_conversations_route():
    conversations = get_all_conversations()
    return jsonify(conversations)


@app.route("/conversation/new_message/<string:conv_id>", methods=["PUT"])
def new_message_route(conv_id):
    try:
        update = get_all_conversations()
        prev_message = get_conversation(conv_id)

        if prev_message is False:
            return jsonify({"error": "Invalid input"}), 400
        if not update:
            return jsonify({"error": "Invalid input"}), 400
        if not is_valid_objectid(conv_id):
            return jsonify({"error": "Invalid conversation ID"}), 400

        msg = prev_message.get("messages", [])
        data = request.get_json()
        new_messages = data["messages"]

        msg = msg + new_messages

        success = update_conversation_by_id(conv_id, {"messages": msg})
        if success:
            return jsonify({"message": "Conversation updated"})
        return jsonify({"error": "Conversation not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid Conversation ID"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/conversation/<string:conv_id>", methods=["DELETE"])
def delete_conversation(conv_id):
    if not is_valid_objectid(conv_id):
        return jsonify({"error": "Invalid conversation ID"}), 400

    success = delete_conversation_by_id(conv_id)
    if success:
        return jsonify({"message": "Conversation deleted"})
    return jsonify({"error": "Conversation not found"}), 404
