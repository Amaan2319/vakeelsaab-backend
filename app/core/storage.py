from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import get_settings
from app.core.exceptions import AppException


settings = get_settings()


class LocalStorageService:
    def __init__(self) -> None:
        self.upload_dir = settings.upload_dir
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, upload_file: UploadFile) -> Path:
        suffix = Path(upload_file.filename or "").suffix.lower()
        filename = f"{uuid4().hex}{suffix}"
        destination = self.upload_dir / filename

        content = await upload_file.read()
        max_size = settings.max_upload_size_mb * 1024 * 1024
        if len(content) > max_size:
            raise AppException(
                f"File is too large. Maximum allowed size is {settings.max_upload_size_mb} MB.",
                status_code=413,
            )

        destination.write_bytes(content)
        await upload_file.seek(0)
        return destination
