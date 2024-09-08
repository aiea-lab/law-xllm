from src import app


@app.route("/")
def hello_world():
    return "<p>AIEA LLM-Logic Team</p>"
