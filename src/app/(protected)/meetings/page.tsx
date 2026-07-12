import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Clock, Users, Plus, Play, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const upcomingMeetings = [
    {
      title: "Backend Refactoring & Prisma Sync",
      time: "Tomorrow at 10:00 AM",
      duration: "45 mins",
      attendees: 3,
      platform: "Google Meet",
    },
    {
      title: "Vulnerability Scan & Next.js 15 Migration",
      time: "Thursday, July 16 at 2:00 PM",
      duration: "60 mins",
      attendees: 5,
      platform: "Zoom",
    },
  ];

  const pastRecordings = [
    {
      title: "Supabase SSR Auth Middleware Walkthrough",
      date: "July 10, 2026",
      duration: "24:12",
      score: "Healthy (92%)",
      author: "Alex Rivers",
    },
    {
      title: "Initial Postgres Database Schema Review",
      date: "July 08, 2026",
      duration: "18:45",
      score: "Warning (74%)",
      author: "Sarah Chen",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Schedule collaborative code reviews or watch recordings of automated reviews.
          </p>
        </div>
        <Button className="w-fit shadow-md shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Schedule Walkthrough
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Meetings */}
        <Card className="border-border/60 bg-card/50 backdrop-blur-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Upcoming Reviews</CardTitle>
            </div>
            <CardDescription>
              Meetings scheduled to align on code architectures and resolve issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.title}
                className="group rounded-xl border border-border/40 bg-accent/20 p-4 hover:bg-accent/40 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-foreground/90 group-hover:text-primary transition-colors">
                    {meeting.title}
                  </h3>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">
                    {meeting.platform}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{meeting.time} ({meeting.duration})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{meeting.attendees} Developers</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="w-full text-xs font-semibold">
                    Join Call <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Past Recordings */}
        <Card className="border-border/60 bg-card/50 backdrop-blur-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle>Recorded Walkthroughs</CardTitle>
            </div>
            <CardDescription>
              Past analysis video sessions covering key features and refactoring guidelines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastRecordings.map((recording) => (
              <div
                key={recording.title}
                className="group flex gap-4 rounded-xl border border-border/40 bg-accent/20 p-4 hover:bg-accent/40 transition-all duration-200"
              >
                {/* Simulated video thumbnail placeholder */}
                <div className="relative flex aspect-video w-24 shrink-0 items-center justify-center rounded-lg bg-black/40 border border-border/30 overflow-hidden">
                  <Play className="h-6 w-6 text-white/80 group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] font-mono text-white/90">
                    {recording.duration}
                  </span>
                </div>

                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-semibold text-xs leading-snug text-foreground/90 group-hover:text-primary transition-colors">
                      {recording.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Recorded on {recording.date} by {recording.author}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-1.5 py-0">
                      {recording.score}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
