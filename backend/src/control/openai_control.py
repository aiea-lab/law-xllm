from flask import jsonify, request
from openai import OpenAIError

from src import app
from src.model.openai_model import handle_openai_request


@app.route("/api/openai", methods=["POST"])
def openai_control():
    print(request.json)
    try:
        return handle_openai_request(request.json)
    except OpenAIError as e:
        return jsonify({"error": f"OpenAIError: {e}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
