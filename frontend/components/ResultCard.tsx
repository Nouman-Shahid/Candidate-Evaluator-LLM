"use client";

import { useEffect, useState } from "react";
import type { EvaluationResult, EducationStatus } from "@/types/evaluation";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  result: EvaluationResult;
}

const VERDICT_CONFIG = {
  strong_match: { label: "Strong Match", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  weak_match:   { label: "Weak Match",   text: "text-amber-400",   border: "border-amber-500/30",   bg: "bg-amber-500/10"   },
  not_a_fit:    { label: "Not a Fit",    text: "text-red-400",     border: "border-red-500/30",     bg: "bg-red-500/10"     },
};

const RECOMMENDATION_CONFIG = {
  apply:      { label: "Apply Now",         icon: "🚀" },
  improve_cv: { label: "Improve CV First",  icon: "✏️" },
  skip:       { label: "Skip This Role",    icon: "⏭️" },
};

const EDU_CONFIG: Record<EducationStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  aligned:     { label: "Aligned",      text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  partial:     { label: "Partial",      text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   dot: "bg-amber-400"   },
  not_aligned: { label: "Not Aligned",  text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     dot: "bg-red-400"     },
};

function scoreColor(s: number) {
  return s >= 7 ? "#10b981" : s >= 5 ? "#f59e0b" : "#ef4444";
}

function scoreTextClass(s: number) {
  return s >= 7 ? "text-emerald-400" : s >= 5 ? "text-amber-400" : "text-red-400";
}

function barColorClass(s: number) {
  return s >= 7 ? "bg-emerald-500" : s >= 5 ? "bg-amber-500" : "bg-red-500";
}

/* ── Circular gauge ─────────────────────────────────────────────────────── */
function ScoreGauge({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, []);

  const r = 42;
  const circ = 2 * Math.PI * r; // ~263.9
  const filled = animated ? (score / 10) * circ : 0;
  const color = scoreColor(score);

  return (
    <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
      <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
        {/* track */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="#27272a" strokeWidth="9" />
        {/* fill */}
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          style={{ transition: "stroke-dasharray 1.1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-3xl font-bold tabular-nums leading-none", scoreTextClass(score))}>
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-zinc-500 mt-0.5">/10</span>
      </div>
    </div>
  );
}

/* ── Animated horizontal bar ────────────────────────────────────────────── */
function CategoryBar({ label, value }: { label: string; value: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value * 10), 200); return () => clearTimeout(t); }, [value]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className={cn("font-semibold tabular-nums", scoreTextClass(value))}>{value}<span className="text-zinc-600 font-normal">/10</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={cn("h-2 rounded-full", barColorClass(value))}
          style={{ width: `${width}%`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>
    </div>
  );
}

/* ── Main card ──────────────────────────────────────────────────────────── */
export function ResultCard({ result }: ResultCardProps) {
  const verdict = VERDICT_CONFIG[result.verdict];
  const rec = RECOMMENDATION_CONFIG[result.recommendation];
  const edu = EDU_CONFIG[result.education.status];
  const { category_scores: cs } = result;

  return (
    <div className="animate-slide-up space-y-4">

      {/* ── Row 1: Score gauge + category bars ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Score panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <ScoreGauge score={result.score} />
            <div className="flex flex-col gap-2 items-end">
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold border", verdict.text, verdict.border, verdict.bg)}>
                {verdict.label}
              </span>
              <span className="text-sm text-zinc-400">{result.match_percentage}% match</span>
              <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-1.5">
                <span className="text-base">{rec.icon}</span>
                <span className="text-xs font-medium text-zinc-200">{rec.label}</span>
              </div>
            </div>
          </div>

          {/* Overall match bar */}
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Overall Match</p>
            <MatchBar value={result.match_percentage} />
          </div>
        </div>

        {/* Category scores panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Category Breakdown</p>
          <div className="space-y-3">
            <CategoryBar label="Technical Skills" value={cs.technical_skills} />
            <CategoryBar label="Experience"       value={cs.experience} />
            <CategoryBar label="Education"        value={cs.education} />
            <CategoryBar label="Soft Skills"      value={cs.soft_skills} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Gap analysis ── */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-base">⚠</span>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Why not a perfect 10?
          </p>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{result.gap_analysis}</p>
      </div>

      {/* ── Row 3: Education alignment ── */}
      <div className={cn("rounded-2xl border p-5 space-y-3", edu.border, edu.bg)}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🎓</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Education Alignment</p>
          </div>
          <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", edu.text, edu.border, edu.bg)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", edu.dot)} />
            {edu.label}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
          <div className="space-y-0.5">
            <p className="text-xs text-zinc-500">Required</p>
            <p className="text-zinc-200">{result.education.required}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-zinc-500">Found in CV</p>
            <p className="text-zinc-200">{result.education.found}</p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 italic">{result.education.note}</p>
      </div>

      {/* ── Row 4: Skills grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SkillsBox title="Strong Skills"   skills={result.strong_skills}  variant="green" />
        <SkillsBox title="Missing Skills"  skills={result.missing_skills} variant="red"   />
      </div>

      {/* ── Row 5: Reasoning ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Analysis</p>
        <p className="text-sm leading-relaxed text-zinc-300">{result.reasoning}</p>
      </div>
    </div>
  );
}

/* ── Match percentage bar (wide) ────────────────────────────────────────── */
function MatchBar({ value }: { value: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 150); return () => clearTimeout(t); }, [value]);
  return (
    <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
      <div
        className={cn("h-2.5 rounded-full", barColorClass(value))}
        style={{ width: `${width}%`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </div>
  );
}

/* ── Skills box ─────────────────────────────────────────────────────────── */
function SkillsBox({ title, skills, variant }: { title: string; skills: string[]; variant: "green" | "red" }) {
  const tag = variant === "green"
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    : "bg-red-500/10 text-red-400 border border-red-500/20";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{title}</p>
      {skills.length === 0 ? (
        <p className="text-xs text-zinc-600 italic">None identified</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className={cn("rounded-md px-2.5 py-1 text-xs font-medium", tag)}>
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
