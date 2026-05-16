from pathlib import Path

from fastapi import APIRouter, Depends, File, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.bns_retriever import get_bns_retriever
from app.core.document_processing import DocumentProcessor
from app.core.gemini import GeminiService
from app.core.storage import LocalStorageService
from app.db.session import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentUploadResponse


router = APIRouter(tags=["documents"])
storage_service = LocalStorageService()
document_processor = DocumentProcessor()
gemini_service = GeminiService()
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"}


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentUploadResponse:
    try:
        saved_path = await storage_service.save_upload(file)

        if saved_path.suffix.lower() in IMAGE_SUFFIXES:
            extracted_text = await gemini_service.extract_text_from_image(saved_path)
            chunks = get_bns_retriever().retrieve(extracted_text, top_k=4)
            retrieved_context = get_bns_retriever().format_chunks(chunks)
            summary = await gemini_service.summarize_document_with_context(
                document_text=extracted_text,
                retrieved_context=retrieved_context,
            )
        else:
            extracted_text = document_processor.extract_text(saved_path)
            summary = await gemini_service.summarize_document(extracted_text)

        file_url = str(request.url_for("uploaded_files", path=Path(saved_path).name))
        document_record = Document(
            user_id=current_user.id,
            file_url=file_url,
            summary=summary,
        )
        db.add(document_record)
        db.commit()
        db.refresh(document_record)

        return DocumentUploadResponse(
            document_id=document_record.id,
            file_url=document_record.file_url,
            summary=document_record.summary,
        )
    except Exception as exc:
        if 'saved_path' in locals() and saved_path.exists():
            saved_path.unlink()
        raise
