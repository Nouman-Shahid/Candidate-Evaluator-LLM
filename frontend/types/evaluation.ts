export type Verdict = "strong_match" | "weak_match" | "not_a_fit";
export type Recommendation = "apply" | "improve_cv" | "skip";
export type EducationStatus = "aligned" | "partial" | "not_aligned";

export interface EducationMatch {
  required: string;
  found: string;
  status: EducationStatus;
  note: string;
}

export interface CategoryScores {
  technical_skills: number;
  experience: number;
  education: number;
  soft_skills: number;
}

export interface EvaluationResult {
  score: number;
  match_percentage: number;
  verdict: Verdict;
  strong_skills: string[];
  missing_skills: string[];
  reasoning: string;
  recommendation: Recommendation;
  gap_analysis: string;
  education: EducationMatch;
  category_scores: CategoryScores;
}

export interface EvaluationResponse {
  success: boolean;
  data?: EvaluationResult;
  error?: string;
}
