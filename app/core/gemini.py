import base64
import mimetypes
from io import BytesIO
from pathlib import Path
from typing import Any

import httpx
from PIL import Image

from app.core.config import get_settings
from app.core.exceptions import AppException


settings = get_settings()

LEGAL_QA_INSTRUCTION = """
You are Vakeel Saab, an AI legal assistant for Indian law.
Provide a short, accurate, plain-language legal answer.
Focus on Bharatiya Nyaya Sanhita (BNS), Indian procedural law, and practical next steps.
State when the user should consult a qualified lawyer.
Do not make up sections or guarantees.
""".strip()

DOCUMENT_SUMMARY_INSTRUCTION = """
You are Vakeel Saab, an AI legal assistant for Indian law.
Summarize the legal document in concise bullet points.
Highlight parties, obligations, deadlines, risks, penalties, and important clauses.
If the text is incomplete or unclear, say so briefly and in easy words so that normal person can also understand.
""".strip()

IMAGE_OCR_INSTRUCTION = """
You are an OCR and legal text extraction assistant.
Extract the visible text from the uploaded legal notice or legal document image as accurately as possible.
Preserve section numbers, dates, party names, addresses, headings, and numbered clauses when they are visible.
If any text is blurry or unreadable, omit guesses and focus only on what is legible.
Return plain text only.
""".strip()

RAG_SUMMARY_INSTRUCTION = """
You are Vakeel Saab, an AI legal assistant for Indian law.
You will receive:
1. Text extracted from a user's legal notice or document image.
2. Retrieved excerpts from a Bharatiya Nyaya Sanhita (BNS) vector index.

Use the retrieved BNS excerpts as supporting legal context when they are relevant.
Provide a concise, practical summary in bullet points.
Clearly separate:
- What the uploaded document appears to say
- Which BNS references seem relevant
- What the user should understand or do next

Do not invent sections. If the retrieved excerpts do not clearly match the document, say so briefly.
""".strip()


class GeminiService:
    def __init__(self) -> None:
        self.api_key = settings.gemini_api_key
        self.base_url = settings.gemini_api_base_url.rstrip("/")

    async def answer_legal_question(self, question: str) -> str:
        prompt = f"Question: {question}"
        return await self._generate_content(
            model=settings.gemini_qa_model,
            instruction=LEGAL_QA_INSTRUCTION,
            prompt=prompt,
        )

    async def summarize_document(self, document_text: str) -> str:
        prompt = f"Document text:\n{document_text}"
        return await self._generate_content(
            model=settings.gemini_summary_model,
            instruction=DOCUMENT_SUMMARY_INSTRUCTION,
            prompt=prompt,
        )

    async def extract_text_from_image(self, image_path: Path) -> str:
        mime_type, encoded_image = self._prepare_image_payload(image_path)
        return await self._generate_multimodal_content(
            model=settings.gemini_summary_model,
            instruction=IMAGE_OCR_INSTRUCTION,
            prompt="Extract all legible text from this uploaded legal notice or legal document image.",
            inline_parts=[
                {
                    "inline_data": {
                        "mime_type": mime_type,
                        "data": encoded_image,
                    }
                }
            ],
        )

    async def summarize_document_with_context(
        self,
        document_text: str,
        retrieved_context: str,
    ) -> str:
        prompt = (
            "Uploaded legal document text:\n"
            f"{document_text}\n\n"
            "Retrieved BNS references:\n"
            f"{retrieved_context}\n"
        )
        return await self._generate_content(
            model=settings.gemini_summary_model,
            instruction=RAG_SUMMARY_INSTRUCTION,
            prompt=prompt,
        )

    async def _generate_content(self, model: str, instruction: str, prompt: str) -> str:
        url = f"{self.base_url}/models/{model}:generateContent"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "systemInstruction": {"parts": [{"text": instruction}]},
            "generationConfig": {"temperature": 0.2},
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    url,
                    params={"key": self.api_key},
                    json=payload,
                )
        except httpx.HTTPError as exc:
            raise AppException("Unable to reach Gemini API.", status_code=502) from exc

        data = response.json()
        if response.status_code >= 400:
            message = data.get("error", {}).get("message", "Gemini API request failed.")
            raise AppException(message, status_code=502)

        text = self._extract_text(data)
        if not text:
            raise AppException("Gemini returned an empty response.", status_code=502)

        return text

    @staticmethod
    def _prepare_image_payload(image_path: Path) -> tuple[str, str]:
        mime_type = mimetypes.guess_type(image_path.name)[0] or "image/jpeg"

        with Image.open(image_path) as image:
            normalized = image.convert("RGB")
            normalized.thumbnail((1800, 1800))

            buffer = BytesIO()
            normalized.save(buffer, format="JPEG", quality=88, optimize=True)

        encoded_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return mime_type, encoded_image

    async def _generate_multimodal_content(
        self,
        model: str,
        instruction: str,
        prompt: str,
        inline_parts: list[dict[str, Any]],
    ) -> str:
        url = f"{self.base_url}/models/{model}:generateContent"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}, *inline_parts],
                }
            ],
            "systemInstruction": {"parts": [{"text": instruction}]},
            "generationConfig": {"temperature": 0.2},
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    url,
                    params={"key": self.api_key},
                    json=payload,
                )
        except httpx.HTTPError as exc:
            raise AppException("The assistant service is temporarily unavailable.", status_code=502) from exc

        data = response.json()
        if response.status_code >= 400:
            message = data.get("error", {}).get("message", "AI request failed.")
            raise AppException(message, status_code=502)

        text = self._extract_text(data)
        if not text:
            raise AppException("The assistant service returned an empty result.", status_code=502)

        return text

    @staticmethod
    def _extract_text(payload: dict[str, Any]) -> str:
        candidates = payload.get("candidates", [])
        if not candidates:
            return ""

        parts = candidates[0].get("content", {}).get("parts", [])
        text_chunks = [part.get("text", "").strip() for part in parts if part.get("text")]
        return "\n".join(chunk for chunk in text_chunks if chunk).strip()
