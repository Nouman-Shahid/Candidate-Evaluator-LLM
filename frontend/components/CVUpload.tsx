"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface CVUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function CVUpload({ file, onChange, disabled }: CVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && isValidFile(dropped)) onChange(dropped);
    },
    [onChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked && isValidFile(picked)) onChange(picked);
  };

  const isValidFile = (f: File) =>
    f.name.endsWith(".pdf") || f.name.endsWith(".docx");

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-zinc-300">CV / Resume</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer min-h-[200px]",
          isDragging
            ? "border-violet-500 bg-violet-500/10"
            : file
            ? "border-emerald-500/60 bg-emerald-500/5"
            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50",
          disabled && "pointer-events-none opacity-50"
        )}
        onClick={() => document.getElementById("cv-file-input")?.click()}
      >
        <input
          id="cv-file-input"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
        />

        {file ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckIcon />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-emerald-400">{file.name}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {(file.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
              <UploadIcon />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-300">
                Drop your CV here
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                PDF or DOCX · Max 5 MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
