import type { EvaluationResponse } from "@/types/evaluation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function evaluateCV(
  file: File,
  jobText: string
): Promise<EvaluationResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_text", jobText);

  const res = await fetch(`${BACKEND_URL}/evaluate`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorBody.detail || `HTTP ${res.status}`);
  }

  return res.json();
}
