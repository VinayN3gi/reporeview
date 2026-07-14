"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface CommitCardProps {
  author: string;
  timeAgo: string;
  title: string;
}

export default function CommitCard({ author, timeAgo, title }: CommitCardProps) {
  // Split commit message into first line (title) and remaining lines (details)
  const lines = title.split("\n").filter((l) => l.trim());
  const heading = lines[0] ?? title;
  const details = lines.slice(1);

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
        <ul className="space-y-1 mt-2">
          {details.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
              <span className="shrink-0 mt-px select-none">✱</span>
              <span>{line.replace(/^[-*]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
