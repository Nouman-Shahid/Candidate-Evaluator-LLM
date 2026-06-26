from pydantic import BaseModel, Field
from typing import Literal


class EducationMatch(BaseModel):
    required: str
    found: str
    status: Literal["aligned", "partial", "not_aligned"]
    note: str


class CategoryScores(BaseModel):
    technical_skills: int = Field(..., ge=0, le=10)
    experience: int = Field(..., ge=0, le=10)
    education: int = Field(..., ge=0, le=10)
    soft_skills: int = Field(..., ge=0, le=10)


class EvaluationResult(BaseModel):
    score: float = Field(..., ge=0, le=10)
    match_percentage: int = Field(..., ge=0, le=100)
    verdict: Literal["strong_match", "weak_match", "not_a_fit"]
    strong_skills: list[str]
    missing_skills: list[str]
    reasoning: str
    recommendation: Literal["apply", "improve_cv", "skip"]
    gap_analysis: str
    education: EducationMatch
    category_scores: CategoryScores


class EvaluationResponse(BaseModel):
    success: bool
    data: EvaluationResult | None = None
    error: str | None = None
