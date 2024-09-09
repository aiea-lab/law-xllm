from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

from llama_index.core import VectorStoreIndex
from llama_index.core import StorageContext
from IPython.display import Markdown, display
from pinecone import Pinecone
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.pinecone import PineconeVectorStore


load_dotenv()

app = Flask(__name__)



def initialize_pinecone():
        
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index("law-index-1")

    return index
def format_doc(text):
    return Markdown(text)

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    query = data['query']
    

    content = retriever.retrieve(query)
    print(content['text'])
    
        

    return {'response': 'success'}





if __name__ == '__main__':
    index = initialize_pinecone()
    embed_model = OpenAIEmbedding()
    vectorstore = PineconeVectorStore(index)
    new_index = VectorStoreIndex.from_vector_store(vectorstore, 
                                                   embedding_model = embed_model)
    retriever = new_index.as_retriever()
    
    
    app.run(debug=True)