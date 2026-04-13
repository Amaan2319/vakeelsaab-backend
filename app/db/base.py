from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.document import Document  # noqa: E402,F401
from app.models.query import Query  # noqa: E402,F401
from app.models.user import User  # noqa: E402,F401

FRONTEND_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173","http://localhost:3000","http://127.0.0.1:3000"]
