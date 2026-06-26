import json
import os
import re
from openai import OpenAI
from models.schemas import EvaluationResult

SYSTEM_PROMPT = """You are an expert technical recruiter. Evaluate CV vs job description strictly and objectively. Return ONLY valid JSON.

SCORING RULES:
9-10 = perfect match (nearly every requirement met, education aligned, deep experience)
7-8 = strong match (most requirements met, minor gaps)
5-6 = partial match (some requirements met, notable gaps)
3-4 = weak match (few requirements met)
0-2 = irrelevant

Be strict. Do not inflate scores. A score of 10 requires a near-perfect fit on ALL dimensions.

OUTPUT FORMAT - return ONLY this JSON object, no markdown, no explanation:
{
  "score": <float 0-10, one decimal>,
  "match_percentage": <int 0-100>,
  "verdict": "<strong_match | weak_match | not_a_fit>",
  "strong_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "reasoning": "<2-3 sentence overall summary of the match>",
  "recommendation": "<apply | improve_cv | skip>",
  "gap_analysis": "<Be specific: what exactly prevents a perfect 10/10 score? List concrete gaps — missing tools, experience shortfalls, degree mismatches, domain gaps. If score is 10 write 'No significant gaps identified.'>",
  "education": {
    "required": "<degree or field the job requires, e.g. Bachelor in Computer Science, or 'Not specified'>",
    "found": "<degree or field found in CV, e.g. BSc Software Engineering, or 'Not mentioned'>",
    "status": "<aligned | partial | not_aligned>",
    "note": "<one sentence: how well does the candidate's education fit the role?>"
  },
  "category_scores": {
    "technical_skills": <int 0-10>,
    "experience": <int 0-10>,
    "education": <int 0-10>,
    "soft_skills": <int 0-10>
  }
}"""

USER_TEMPLATE = """CV TEXT:
{cv_text}

---

JOB DESCRIPTION:
{job_text}

Evaluate this CV against the job description and return only the JSON response."""


def _extract_json(raw: str) -> dict:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


def evaluate_cv(cv_text: str, job_text: str) -> EvaluationResult:
    client = OpenAI(
        api_key=os.environ["GROQ_API_KEY"],
        base_url="https://api.groq.com/openai/v1",
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1500,
        temperature=0.1,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": USER_TEMPLATE.format(
                    cv_text=cv_text[:8000],
                    job_text=job_text[:4000],
                ),
            },
        ],
    )

    raw = response.choices[0].message.content or ""
    data = _extract_json(raw)
    return EvaluationResult(**data)
