# Vakeel Saab Backend

Production-ready FastAPI backend for the Vakeel Saab legal assistant.

## Features

- Email/password signup and login with bcrypt hashing
- JWT authentication for protected routes
- PostgreSQL with SQLAlchemy ORM
- Gemini-powered legal Q&A and document summarization
- File uploads with local storage and OCR/text extraction
- Environment-based configuration
- CORS enabled for the React frontend

## Project Structure

```text
app/
  core/
  db/
  models/
  routes/
  schemas/
  main.py
```

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and update the values.
4. Ensure PostgreSQL is running and the database exists.
5. Install Tesseract OCR if you want image OCR support.
6. Run the API:

   ```bash
   uvicorn app.main:app --reload
   ```

## API Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /ask` (Bearer token required)
- `POST /upload` (Bearer token required)

Uploaded files are served from `/uploads/<filename>`.

## Notes

- PDF files are parsed directly and fall back to OCR when needed.
- DOCX and TXT uploads are also supported.
- FastAPI docs are disabled by default and are only exposed when `DEBUG=true`.
- For production, use a strong JWT secret and add proper migrations and object storage as needed.
