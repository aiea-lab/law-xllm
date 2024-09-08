from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

app = Flask(__name__)
# CORS(app=app)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["MONGO_URI"] = "mongodb://localhost:27017/flask_database"
mongo = PyMongo(app)

if __name__ == "__main__":
    app.run(debug=True)
