from pydantic import BaseModel, ConfigDict, Field


class AskRequest(BaseModel):
    question: str = Field(min_length=5, max_length=4000)


class AskResponse(BaseModel):
    query_id: int
    question: str
    answer: str


class QueryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    question: str
    answer: str
