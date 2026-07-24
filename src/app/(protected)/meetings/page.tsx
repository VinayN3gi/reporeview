import React from "react";
import { getCurrentUserAction, getCurrentDbUserAction } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { Calendar, Users, Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect("/signin");
  }

  const upcomingMeetings = [
    {
      title: "Architecture Review",
      time: "Tomorrow at 10:00 AM",
      duration: "45 min",
      platform: "Google Meet",
      attendees: 4,
    },
    {
      title: "Weekly Sync",
      time: "Friday at 2:00 PM",
      duration: "30 min",
      platform: "Zoom",
      attendees: 2,
    }
  ];

  const pastRecordings = [
    {
      title: "Initial Tech Spec Walkthrough",
      author: "Alex",
      date: "Jul 12, 2026",
      duration: "54:21",
      score: "Healthy (92%)",
    },
    {
      title: "Database Migration Planning",
      author: "Sam",
      date: "Jul 05, 2026",
      duration: "32:10",
      score: "Warning (64%)",
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Meetings</h2>
        <p className="text-muted-foreground">Your scheduled calls and recorded walkthroughs.</p>
      </div>

      {/* Upcoming */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Upcoming</h3>
        {upcomingMeetings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcomingMeetings.map((m) => (
              <div
                key={m.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.time} &middot; {m.duration} &middot; {m.platform}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> {m.attendees}
                  </span>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming meetings scheduled.</p>
        )}
      </div>

      {/* Past recordings */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Past recordings</h3>
        {pastRecordings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {pastRecordings.map((r) => {
              const isHealthy = r.score.startsWith("Healthy");
              return (
                <div
                  key={r.title}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5 text-foreground/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.author} &middot; {r.date} &middot; {r.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="outline"
                      className={
                        isHealthy
                          ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                          : "text-accent-amber border-accent-amber/30 bg-accent-amber/10"
                      }
                    >
                      {r.score}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No past recordings yet.</p>
        )}
      </div>
    </div>
  );
}
