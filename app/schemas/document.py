from pydantic import BaseModel, ConfigDict


class DocumentUploadResponse(BaseModel):
    document_id: int
    file_url: str
    summary: str


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    file_url: str
    summary: str
