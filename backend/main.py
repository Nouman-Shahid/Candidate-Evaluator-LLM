import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import EvaluationResponse
from services.cv_extractor import extract_cv_text
from services.llm_evaluator import evaluate_cv

app = FastAPI(title="CV-Evaluator-LLM API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(
    file: UploadFile = File(...),
    job_text: str = Form(...),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    lower = file.filename.lower()
    if not (lower.endswith(".pdf") or lower.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    if not job_text.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5 MB.")

    try:
        cv_text = extract_cv_text(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to extract text from CV.")

    try:
        result = evaluate_cv(cv_text, job_text.strip())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM evaluation failed: {str(e)}")

    return EvaluationResponse(success=True, data=result)
