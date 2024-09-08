from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.pinecone import PineconeVectorStore
from IPython.display import Markdown, display

load_dotenv()

app = Flask(__name__)

def initialize_pinecone():
        
    PINECONE_API_KEY = os.getenv["PINECONE_API_KEY"]
    pc = Pinecone(api_key=PINECONE_API_KEY)

    return index

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    query = data['query']
    response = index.query(queries=[query], top_k=5)
    return jsonify(response)





if __name__ == '__main__':
    app.run(debug=True)