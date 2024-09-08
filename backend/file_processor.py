import requests
import os
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
from llama_index.core import Document

load_dotenv()

embed_model = OpenAIEmbedding()
splitter = SemanticSplitterNodeParser(
    buffer_size=1, breakpoint_percentile_threshold=95, embed_model=embed_model
)



def initialize_pinecone():
    
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index_name = "law-index"
    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
    if index_name not in existing_indexes:
        print("Creating index")
        pc.create_index(
            name=index_name, 
            dimension=1536,
            metric="cosine",
            spec = ServerlessSpec(cloud="aws", region="us-west-2"),
        )
    index = pc.Index(index_name)
    return index


# def chunk_embed_text(text):
def scrape_site(url: str) -> str:
  response = requests.get("https://r.jina.ai/" + url)
  return response.text


def add_to_index(url, text):
    
    vectors = []
    document = Document(text=text, id_=url)  # Assuming `text` is the content and `url` is the identifier
    nodes = splitter.get_nodes_from_documents([document])
    for node in nodes:
        vector_id = node.id_
        text = node.text
        vector = embed_model.get_text_embedding(text)
        vectors.append((vector_id, vector))

    index.upsert(vectors)


        
        

        
        


  
def files_to_vectorstore(file_dir):
    with open(file_dir) as files:

        for file in files:
            text = scrape_site(file)
            add_to_index(url = file, text = text)

            


    
        


if __name__ == '__main__':
    embed_model = OpenAIEmbedding()
    index = initialize_pinecone()

    files_to_vectorstore('law_scraper/filtered_links.txt')



