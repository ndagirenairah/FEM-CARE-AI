import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FemCare AI — Complete Women's Health Platform",
  description:
    "An AI-powered women's health ecosystem: cycle tracking, health assessments, symptom checking, education, nutrition, fitness, mental wellness and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-rose-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
