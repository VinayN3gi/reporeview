import React from "react";
import { Loader2, Code2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] h-full w-full py-12">
      <div className="relative group max-w-sm w-full">
        {/* Glow effect */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-violet-600 to-indigo-500 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-1000 animate-pulse" />
        
        {/* Glassmorphic Card Container */}
        <div className="relative bg-card/60 border border-border/80 backdrop-blur-lg rounded-3xl p-10 flex flex-col items-center gap-6 shadow-2xl">
          {/* Animated Spinner with Core Icon */}
          <div className="relative flex items-center justify-center">
            {/* Spinning Outer Ring */}
            <div className="h-16 w-16 rounded-full border-3 border-muted/30 border-t-primary border-r-violet-500 animate-spin" />
            
            {/* Pulsing Center Icon */}
            <div className="absolute flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary animate-pulse">
              <Code2 className="h-5.5 w-5.5" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-1.5 animate-pulse duration-1000">
            <h3 className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Syncing Workspace
            </h3>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              Retrieving repository analytics...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
