# from https://github.com/TommyClemenzaChen/RAG/blob/main/src/components/rag_functions.py

import os

import chromadb
from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.prompts import PromptTemplate
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.vector_stores import VectorStoreQuery
from pinecone import Pinecone, Index, ServerlessSpec
from llama_index.core import QueryBundle
from llama_index.core.retrievers import BaseRetriever
from typing import Any, List
from llama_index.core.schema import NodeWithScore
from typing import Optional
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.query_engine import CustomQueryEngine
from llama_index.core.retrievers import BaseRetriever
from llama_index.core import get_response_synthesizer
from llama_index.core.response_synthesizers import BaseSynthesizer
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

class PineconeRetriever(BaseRetriever):
    """Retriever over a pinecone vector store."""

    def __init__(
        self,
        vector_store: PineconeVectorStore,
        embed_model: Any,
        query_mode: str = "default",
        similarity_top_k: int = 2,
    ) -> None:
        """Init params."""
        self._vector_store = vector_store
        self._embed_model = embed_model
        self._query_mode = query_mode
        self._similarity_top_k = similarity_top_k
        super().__init__()

    def _retrieve(self, query_bundle: QueryBundle) -> List[NodeWithScore]:
        """Retrieve."""
        if query_bundle.embedding is None:
            query_embedding = self._embed_model.get_query_embedding(
                query_bundle.query_str
            )
        else:
            query_embedding = query_bundle.embedding

        vector_store_query = VectorStoreQuery(
            query_embedding=query_embedding,
            similarity_top_k=self._similarity_top_k,
            mode=self._query_mode,
        )
        query_result = self._vector_store.query(vector_store_query)

        nodes_with_scores = []
        for index, node in enumerate(query_result.nodes):
            score: Optional[float] = None
            if query_result.similarities is not None:
                score = query_result.similarities[index]
            nodes_with_scores.append(NodeWithScore(node=node, score=score))

        return nodes_with_scores

qa_prompt = PromptTemplate(
    "You are a california law librarian giving someone a step by step instruction on how to solve their legal problems in California.\n"
    "Disclaim that you are not a licensed attorney and you cannot practice law."
    "Include information about what forms to fill, who they should contact, and next steps\n"
    "Given the Context information below and not prior knowledge.\n"
    "Be empethetic and end the message with a kind note."
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "answer the query.\n"
    "Query: {query_str}\n"
    "Answer: "
)
    
class RAGStringQueryEngine(CustomQueryEngine):
    """RAG String Query Engine."""

    retriever: BaseRetriever
    response_synthesizer: BaseSynthesizer
    llm: OpenAI
    qa_prompt: PromptTemplate

    def custom_query(self, query_str: str):
        nodes = self.retriever.retrieve(query_str)

        context_str = "\n\n".join([n.node.get_content() for n in nodes])
        response = self.llm.complete(
            qa_prompt.format(context_str=context_str, query_str=query_str)
        )

        return str(response)

def query(query_str: str):

    api_key = os.environ["PINECONE_API_KEY"]
    pc = Pinecone(api_key=api_key)
    dataset_name = "law-index-1"
    pinecone_index = pc.Index(dataset_name)
    embed_model = OpenAIEmbedding()
    pinecone_index = pc.Index(dataset_name)
    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    query_embedding = embed_model.get_query_embedding(query_str)

    query_mode = "default"

    vector_store_query = VectorStoreQuery(query_embedding=query_embedding, similarity_top_k=2, mode=query_mode)
    query_result = vector_store.query(vector_store_query)

    nodes_with_scores = []

    for index, node in enumerate(query_result.nodes):
        score: Optional[float] = None
        if query_result.similarities is not None:
            score = query_result.similarities[index]
        nodes_with_scores.append(NodeWithScore(node=node, score=score))

    retriever = PineconeRetriever(vector_store, embed_model, query_mode="default", similarity_top_k=2)

    retrieved_nodes = retriever.retrieve(query_str)

    for node in retrieved_nodes:
        print(type(node))
        
    # llm = OpenAI(model = "gpt-3.5-turbo", api_key=api_key)
    # context = node.get_text()
    # print(context)
    # print(query_result)
    # formatted_prompt = qa_prompt.format(context_str=context, query_str=query_result)
    
    # response = llm.invoke(formatted_prompt)
    
    synthesizer = get_response_synthesizer(response_mode="compact")
    llm = OpenAI(model="gpt-3.5-turbo")

    query_engine = RAGStringQueryEngine(
        retriever=retriever,
        response_synthesizer=synthesizer,
        llm=llm,
        qa_prompt=qa_prompt,
    )

    response = query_engine.query(query_str)

    print(str(response))

    return str(response)
    
 