from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.gemini import GeminiService
from app.db.session import get_db
from app.models.query import Query
from app.models.user import User
from app.schemas.query import AskRequest, AskResponse
from app.schemas.query import QueryRead


router = APIRouter(tags=["assistant"])
gemini_service = GeminiService()


@router.post("/ask", response_model=AskResponse, status_code=status.HTTP_200_OK)
async def ask_question(
    payload: AskRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AskResponse:
    answer = await gemini_service.answer_legal_question(payload.question)

    query_record = Query(
        user_id=current_user.id,
        question=payload.question,
        answer=answer,
    )
    db.add(query_record)
    db.commit()
    db.refresh(query_record)

    return AskResponse(
        query_id=query_record.id,
        question=query_record.question,
        answer=query_record.answer,
    )


@router.get("/queries", response_model=list[QueryRead], status_code=status.HTTP_200_OK)
def list_queries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Query]:
    query_records = (
        db.query(Query)
        .filter(Query.user_id == current_user.id)
        .order_by(Query.id.asc())
        .all()
    )
    return query_records
