"use client";

import { useState } from "react";
import { CVUpload } from "@/components/CVUpload";
import { ResultCard } from "@/components/ResultCard";
import { evaluateCV } from "@/lib/api";
import type { EvaluationResult } from "@/types/evaluation";
import { cn } from "@/lib/utils";

/* ── Static particle positions (avoids hydration mismatch) ─────────────── */
const PARTICLES = [
  { x: 8,  y: 15, s: 2, d: 0,   t: 14 }, { x: 92, y: 8,  s: 3, d: 1.5, t: 17 },
  { x: 23, y: 78, s: 2, d: 3,   t: 12 }, { x: 67, y: 22, s: 1, d: 0.8, t: 19 },
  { x: 45, y: 92, s: 3, d: 2.2, t: 15 }, { x: 78, y: 55, s: 2, d: 4,   t: 11 },
  { x: 15, y: 45, s: 1, d: 1,   t: 20 }, { x: 55, y: 35, s: 3, d: 3.5, t: 13 },
  { x: 88, y: 80, s: 2, d: 0.5, t: 16 }, { x: 35, y: 60, s: 1, d: 2.8, t: 18 },
  { x: 72, y: 12, s: 2, d: 1.2, t: 14 }, { x: 5,  y: 88, s: 3, d: 4.5, t: 10 },
  { x: 60, y: 72, s: 1, d: 0.3, t: 22 }, { x: 30, y: 30, s: 2, d: 3.8, t: 15 },
  { x: 82, y: 40, s: 3, d: 2,   t: 13 },
];

export default function Home() {
  const [file, setFile]       = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<EvaluationResult | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const canSubmit = file !== null && jobText.trim().length > 20 && !loading;

  async function handleSubmit() {
    if (!canSubmit || !file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await evaluateCV(file, jobText);
      if (res.success && res.data) setResult(res.data);
      else setError(res.error || "Evaluation failed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Animated AI background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden ai-grid">
        {/* Aurora blobs */}
        <div className="animate-aurora-1 absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="animate-aurora-2 absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/10   blur-3xl" />
        <div className="animate-aurora-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-cyan-600/7 blur-3xl" />
        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400/25"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.s, height: p.s,
              animationName: "float",
              animationDuration: `${p.t}s`,
              animationDelay: `${p.d}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-violet-900/30 bg-[#04040c]/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="animate-glow-pulse flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600/90">
              <NeuralIcon />
            </div>
            <span className="text-sm font-bold text-zinc-100 tracking-tight">
              CV-Evaluator<span className="text-violet-400">-LLM</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-500 hidden sm:block">AI Online</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">

        {/* ── Hero ── */}
        <div className="animate-slide-up text-center space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs text-violet-300 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Evaluation
          </div>
          <h1 className="gradient-text text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Know your fit<br className="hidden sm:block" /> before you apply
          </h1>
          <p className="animate-slide-up-d text-zinc-500 text-sm sm:text-base max-w-md mx-auto">
            Upload your CV, paste a job description, and get an instant AI match score with detailed feedback.
          </p>
        </div>

        {/* ── Input grid ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="card-glow animate-fade-in rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm p-5 transition-all duration-300">
            <CVUpload file={file} onChange={setFile} disabled={loading} />
          </div>
          <div className="card-glow animate-fade-in rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm p-5 flex flex-col gap-3 transition-all duration-300">
            <label htmlFor="job-description" className="text-sm font-medium text-zinc-300">
              Job Description
            </label>
            <textarea
              id="job-description"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              disabled={loading}
              placeholder="Paste the full job description here…"
              className={cn(
                "flex-1 min-h-[200px] w-full resize-none rounded-xl border border-zinc-700/70 bg-zinc-950/60 px-4 py-3",
                "text-sm text-zinc-200 placeholder-zinc-600 leading-relaxed",
                "focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40",
                "transition-all duration-200 disabled:opacity-50"
              )}
            />
            <p className="text-xs text-zinc-600">{jobText.length} characters</p>
          </div>
        </div>

        {/* ── Analyze button ── */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "relative flex items-center gap-2.5 rounded-xl px-9 py-3.5 text-sm font-semibold transition-all duration-200 overflow-hidden",
              canSubmit
                ? "btn-shimmer text-white shadow-lg shadow-violet-700/30 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-violet-300/40 border-t-white animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <SparklesIcon />
                Analyze Match
              </>
            )}
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="animate-fade-in rounded-2xl border border-violet-900/30 bg-violet-950/20 backdrop-blur-sm p-10 text-center space-y-5">
            {/* Bouncing dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full bg-violet-500 animate-bounce-dot"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
            {/* Scanning bar */}
            <div className="relative mx-auto h-1 w-48 rounded-full bg-zinc-800 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-scan" />
            </div>
            <div>
              <p className="text-sm text-zinc-300 font-medium">Neural processing in progress</p>
              <p className="text-xs text-zinc-600 mt-1">Extracting CV · Evaluating match · Generating insights</p>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="animate-slide-up rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex gap-3">
            <ErrorIcon />
            <div>
              <p className="text-sm font-semibold text-red-400">Evaluation failed</p>
              <p className="text-xs text-red-400/60 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {result && !loading && <ResultCard result={result} />}
      </main>
    </>
  );
}

function NeuralIcon() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="5"  cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="6"  r="2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="18" r="2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path strokeLinecap="round" d="M7 12h3M14 12l3-4.5M14 12l3 4.5" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="h-5 w-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}
