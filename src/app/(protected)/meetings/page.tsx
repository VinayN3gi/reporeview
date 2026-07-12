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
      Meetings
    </div>
  );
}
