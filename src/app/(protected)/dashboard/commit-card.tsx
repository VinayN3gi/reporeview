"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface CommitCardProps {
  author: string;
  timeAgo: string;
  title: string;
  bullets: string[];
}

export default function CommitCard({ author, timeAgo, title, bullets }: CommitCardProps) {
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
      <h4 className="text-sm font-bold text-foreground mb-2.5">{title}</h4>

      {/* Bullet Points */}
      <ul className="space-y-1">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
            <span className="shrink-0 mt-px select-none">✱</span>
            <span>
              {bullet.split(/(`[^`]+`)/).map((part, j) =>
                part.startsWith("`") && part.endsWith("`") ? (
                  <code
                    key={j}
                    className="text-xs bg-muted px-1 py-0.5 rounded font-mono text-foreground/80"
                  >
                    {part.slice(1, -1)}
                  </code>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
