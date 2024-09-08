# from https://github.com/TommyClemenzaChen/RAG/blob/main/src/components/rag_functions.py

import os

import chromadb
from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.prompts import PromptTemplate

from llama_index.llms.openai import OpenAI
from dotenv import load_dotenv


CHROMA_PATH = "src/data/"

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")


# Used when we run the image
# IMAGE_RUN = ???

def get_retriever(k = 3):
    db = chromadb.PersistentClient(path=CHROMA_PATH)
    chroma_collection = db.get_or_create_collection("chroma_db")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

    embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")

    index = VectorStoreIndex.from_vector_store(
        vector_store,
        embedding_model = embed_model,
        
    )
    retriever= index.as_retriever(similarity_top_k = k)
    
    return retriever

def query(retriever, query_text: str):
    return "Cooked"
    # retrieved_content = retriever.retrieve(query_text)

    # # Extracting text from the selected nodes
    # context = "Context"
    # for content in retrieved_content:
    #     context += content.text + "\n"
    
    # llm = OpenAI(model = "gpt-3.5-turbo", api_key=api_key)

    # prompt = PromptTemplate(
    #     "Context information is below.\n"
    #     "---------------------\n"
    #     "{context_str}\n"
    #     "---------------------\n"
    #     "Given the context information and not prior knowledge, "
    #     "answer the query.\n"
    #     "Query: {query_str}\n"
    #     "Answer: "
    # )

    # formatted_prompt = prompt.format(context_str=context, query_str=query_text)
    
    # response = llm.complete(formatted_prompt)

    # return response.text
    
 