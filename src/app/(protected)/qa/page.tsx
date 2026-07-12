import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Sparkles, MessageSquare, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QaPage() {
  const suggestions = [
    "Explain user auth integration",
    "Where is Prisma database initialized?",
    "Find potential security issues in layout",
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-4 h-[calc(100vh-8.5rem)]">
      Q AND A
    </div>
  );
}
