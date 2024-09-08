import os
from dotenv import load_dotenv

load_dotenv()

import src.control.auth_control
import src.control.control
import src.control.conversation_control
import src.control.google_control
import src.control.openai_control
import src.control.user_control
from src import app

if __name__ == "__main__":
    app.run(port=5000, debug=True)
