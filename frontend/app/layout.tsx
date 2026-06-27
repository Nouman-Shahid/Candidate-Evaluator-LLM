import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV-Evaluator-LLM",
  description: "LLM-powered CV evaluator — score your resume against any job description.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
