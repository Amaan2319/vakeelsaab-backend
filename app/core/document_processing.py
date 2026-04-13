from pathlib import Path

import fitz
import pytesseract
from PIL import Image

from app.core.config import get_settings
from app.core.exceptions import AppException

try:
    from docx import Document as DocxDocument
except ImportError:  # pragma: no cover
    DocxDocument = None


settings = get_settings()


class DocumentProcessor:
    def __init__(self) -> None:
        if settings.tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

    def extract_text(self, file_path: Path) -> str:
        suffix = file_path.suffix.lower()

        if suffix in {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"}:
            return self._extract_from_image(file_path)
        if suffix == ".pdf":
            return self._extract_from_pdf(file_path)
        if suffix == ".txt":
            return file_path.read_text(encoding="utf-8", errors="ignore").strip()
        if suffix == ".docx":
            return self._extract_from_docx(file_path)

        raise AppException(
            "Unsupported file type. Please upload a PDF, DOCX, TXT, or image file.",
            status_code=415,
        )

    def _extract_from_image(self, file_path: Path) -> str:
        try:
            with Image.open(file_path) as image:
                text = pytesseract.image_to_string(image).strip()
        except pytesseract.TesseractNotFoundError as exc:
            raise AppException(
                "Tesseract OCR is not installed or not configured on this server.",
                status_code=500,
            ) from exc

        if not text:
            raise AppException("No readable text was found in the uploaded image.", status_code=422)
        return text

    def _extract_from_pdf(self, file_path: Path) -> str:
        collected_text = []

        with fitz.open(file_path) as document:
            for page in document:
                page_text = page.get_text("text").strip()
                if page_text:
                    collected_text.append(page_text)
                    continue

                pixmap = page.get_pixmap(dpi=220)
                image = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)

                try:
                    ocr_text = pytesseract.image_to_string(image).strip()
                except pytesseract.TesseractNotFoundError as exc:
                    raise AppException(
                        "Tesseract OCR is not installed or not configured on this server.",
                        status_code=500,
                    ) from exc

                if ocr_text:
                    collected_text.append(ocr_text)

        text = "\n\n".join(chunk for chunk in collected_text if chunk).strip()
        if not text:
            raise AppException("No readable text was found in the uploaded PDF.", status_code=422)
        return text

    def _extract_from_docx(self, file_path: Path) -> str:
        if DocxDocument is None:
            raise AppException("DOCX support is not installed on this server.", status_code=500)

        document = DocxDocument(file_path)
        text = "\n".join(paragraph.text for paragraph in document.paragraphs).strip()
        if not text:
            raise AppException("No readable text was found in the uploaded DOCX file.", status_code=422)
        return text
