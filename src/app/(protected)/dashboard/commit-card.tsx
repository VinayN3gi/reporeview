"use client";

import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";

interface CommitCardProps {
  author: string;
  timeAgo: string;
  title: string;
  summary?: string;
}

export default function CommitCard({ author, timeAgo, title, summary }: CommitCardProps) {
  // Split commit message into first line (title) and remaining lines (details)
  const lines = title.split("\n").filter((l) => l.trim());
  const heading = lines[0] ?? title;
  const details = lines.slice(1);

  // Split summary into bullet points
  const summaryLines = summary
    ? summary.split("\n").filter((l) => l.trim())
    : [];

  return (
    <div className="border border-border bg-card rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Author Row */}
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-foreground">{author}</span>
          <span className="text-muted-foreground">committed</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground/60" />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
      </div>

      {/* Commit Title */}
      <h4 className="text-sm font-bold text-foreground mb-1">{heading}</h4>

      {/* Commit Details (extra lines from the message) */}
      {details.length > 0 && (
        <ul className="space-y-1 mt-2 mb-3">
          {details.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
              <span className="shrink-0 mt-px select-none text-[10px]">✱</span>
              <span>{line.replace(/^[-*]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      )}

      {/* AI Summary Section */}
      {summaryLines.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-primary/3 border border-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/1 to-transparent pointer-events-none" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Summary</span>
          </div>
          <ul className="space-y-1.5">
            {summaryLines.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-primary/40" />
                <span>{line.replace(/^[-*]\s*/, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
