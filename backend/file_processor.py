import requests
import os
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.openai import OpenAIEmbedding
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
from llama_index.core.schema import TextNode
from llama_index.vector_stores.pinecone import PineconeVectorStore



load_dotenv()

embed_model = OpenAIEmbedding()
text_parser = SentenceSplitter(
    chunk_size=500,
    chunk_overlap=50,
    # separator=" ",

)



def initialize_pinecone():
    
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index_name = "law-index-1"
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
    # index.delete(deleteAll=True)
    return index


# def chunk_embed_text(text):
def scrape_site(url: str) -> str:
  response = requests.get("https://r.jina.ai/" + url)
  return response.text


def add_to_index(idx, url, text):
    
    text_chunks, doc_idxs = [], []
    chunk = text_parser.split_text(text)
    text_chunks.extend(chunk)

    doc_idxs.extend([idx] * len(chunk))

    nodes = []
    for idx, text_chunk in enumerate(text_chunks):
        node = TextNode(
            text=text_chunk,
        )
        # src_doc_idx = doc_idxs[idx]
        # src_page = url
        nodes.append(node)

    embed_model = OpenAIEmbedding()
    for node in nodes:
        node_embedding = embed_model.get_text_embedding(
            node.get_content(metadata_mode="all")
        )
        node.embedding = node_embedding

    vector_store.add(nodes)


   


  
def files_to_vectorstore(file_dir):
    with open(file_dir) as files:

        for i, file in enumerate(files):
            text = scrape_site(file)
            add_to_index(idx = i, url = file, text = text)

            


    
        


if __name__ == '__main__':
    embed_model = OpenAIEmbedding()
    index = initialize_pinecone()
    vector_store = PineconeVectorStore(index)

    files_to_vectorstore('law_scraper/filtered_links.txt')



