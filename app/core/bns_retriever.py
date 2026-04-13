from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
import pickle

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.config import get_settings
from app.core.exceptions import AppException


settings = get_settings()
BNS_INDEX_DIR = Path(__file__).resolve().parents[1] / "bns_index"
DEFAULT_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


@dataclass
class RetrievedChunk:
    score: float
    page_content: str
    metadata: dict


class BNSRetriever:
    def __init__(self) -> None:
        index_path = BNS_INDEX_DIR / "index.faiss"
        store_path = BNS_INDEX_DIR / "index.pkl"

        if not index_path.exists() or not store_path.exists():
            raise AppException("BNS legal index is not available on this server.", status_code=500)

        self.index = faiss.read_index(str(index_path))

        with store_path.open("rb") as file:
            self.docstore, self.index_to_docstore_id = pickle.load(file)

        self.embedding_model = SentenceTransformer(
            DEFAULT_EMBEDDING_MODEL,
            local_files_only=True,
        )

        if self.index.d != self.embedding_model.get_sentence_embedding_dimension():
            raise AppException(
                "BNS legal index configuration is invalid on this server.",
                status_code=500,
            )

    def retrieve(self, query: str, top_k: int = 4) -> list[RetrievedChunk]:
        cleaned_query = " ".join(query.split()).strip()
        if not cleaned_query:
            return []

        query_vector = self.embedding_model.encode([cleaned_query], normalize_embeddings=False)
        vector = np.array(query_vector, dtype="float32")

        distances, indices = self.index.search(vector, top_k)
        results: list[RetrievedChunk] = []

        for score, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue

            doc_id = self.index_to_docstore_id.get(int(idx))
            if not doc_id:
                continue

            doc = self.docstore._dict.get(doc_id)
            if not doc:
                continue

            results.append(
                RetrievedChunk(
                    score=float(score),
                    page_content=doc.page_content,
                    metadata=doc.metadata,
                )
            )

        return results

    @staticmethod
    def format_chunks(chunks: list[RetrievedChunk]) -> str:
        if not chunks:
            return "No matching BNS reference chunks were found."

        formatted_sections = []
        for index, chunk in enumerate(chunks, start=1):
            source = chunk.metadata.get("source", "Unknown source")
            page = chunk.metadata.get("page_label") or chunk.metadata.get("page") or "Unknown page"
            formatted_sections.append(
                f"[Reference {index}] Source: {source}, Page: {page}\n{chunk.page_content.strip()}"
            )

        return "\n\n".join(formatted_sections)


@lru_cache
def get_bns_retriever() -> BNSRetriever:
    return BNSRetriever()
