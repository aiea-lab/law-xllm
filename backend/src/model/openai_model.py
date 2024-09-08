import os

import dotenv
from flask import jsonify
from openai import OpenAI, OpenAIError

import src.control.rag_functions as rag

dotenv.load_dotenv()
API_KEY = os.environ.get("OPEN_AI_API_KEY")
client = OpenAI(api_key=API_KEY)


def handle_openai_request(data):
    print(data["messages"][0]["content"])
    
    try:
        model, messages = get_model_and_messages(data)
        response_message = call_openai_api(model, messages)
        return jsonify({"choices": [{"message": {"content": response_message}}]})
    except OpenAIError as e:
        return jsonify({"error": f"OpenAIError: {e}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_model_and_messages(data):
    """Extract model and messages from the request data, with default values."""
    model = data.get("model", "gpt-3.5-turbo")
    print(data["messages"][0]["content"])
    messages = data.get("messages", get_default_messages())
    return model, messages


def get_default_messages():
    """Return the default messages for the OpenAI API request."""
    return [
        {
            "role": "system",
            "content": "",
        }
    ]


def call_openai_api(model, messages):
    """Call the OpenAI API and return the response message."""
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
        )
        return completion.choices[0].message.content
    except OpenAIError as e:
        print("OpenAI API error:", str(e))
        raise
    except Exception as e:
        print("General error:", str(e))
        raise

def get_rag(prompt):
    result = rag.query(prompt)
    return result