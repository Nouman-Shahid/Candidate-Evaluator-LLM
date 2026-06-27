# Candidate Evaluator LLM

AI-powered tool that scores how well a candidate's CV matches a job description. Returns a score out of 10 plus structured feedback on strong skills, missing skills, and a recommendation.

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, pypdf, python-docx, Groq API

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your Groq API key:

```
GROQ_API_KEY=gsk_...
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`. Health check: `http://localhost:8000/health`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000`
2. Upload your CV (PDF or DOCX, max 5 MB)
3. Paste the job description
4. Click **Analyze Match**

## API

### `POST /evaluate`

Multipart form request:

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | CV in PDF or DOCX format |
| `job_text` | string | Full job description text |

Response:

```json
{
  "success": true,
  "data": {
    "score": 7.5,
    "match_percentage": 75,
    "verdict": "strong_match",
    "strong_skills": ["Python", "FastAPI", "PostgreSQL"],
    "missing_skills": ["Kubernetes", "Terraform"],
    "reasoning": "The candidate has strong backend skills...",
    "recommendation": "apply"
  }
}
```

## Project Structure

```
candidate-evaluator-llm/
├── backend/
│   ├── main.py                  # FastAPI app + /evaluate endpoint
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── schemas.py           # Pydantic response models
│   └── services/
│       ├── cv_extractor.py      # PDF/DOCX text extraction
│       └── llm_evaluator.py     # Groq API integration
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx             # Main UI page
    │   └── globals.css
    ├── components/
    │   ├── CVUpload.tsx         # Drag-and-drop file input
    │   └── ResultCard.tsx       # Score + skills display
    ├── lib/
    │   ├── api.ts               # Backend API client
    │   └── utils.ts             # cn() helper
    ├── types/
    │   └── evaluation.ts        # Shared TypeScript types
    └── package.json
```

## Extending to SaaS

When you're ready to productize:

- **Auth**: Add Clerk or NextAuth to the frontend
- **Database**: Store evaluation history in PostgreSQL via Prisma
- **Payments**: Wrap with Stripe + usage limits per tier
- **Queue**: Move LLM calls to a background worker (BullMQ / Celery)
- **Deploy**: Backend → Railway/Render, Frontend → Vercel
