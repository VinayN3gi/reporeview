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
      {/* Sidebar - Chat list */}
      <Card className="lg:col-span-1 border-border/60 bg-card/45 backdrop-blur-xs flex flex-col h-full overflow-hidden">
        <CardHeader className="py-4 flex flex-row items-center justify-between border-b border-border/40 shrink-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            History
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 flex-1 overflow-y-auto space-y-1">
          <div className="flex items-center gap-2.5 rounded-lg bg-accent/70 px-3 py-2.5 text-sm font-medium text-foreground cursor-pointer transition-all border border-border/20">
            <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">Database schema connection</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/40 cursor-pointer transition-all">
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="truncate">Optimize repository query speed</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/40 cursor-pointer transition-all">
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="truncate">Setup supabase actions middleware</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Interface */}
      <Card className="lg:col-span-3 border-border/60 bg-card/45 backdrop-blur-xs flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <CardHeader className="py-4 border-b border-border/40 shrink-0 flex-row items-center gap-3 space-y-0">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
            <CardDescription className="text-xs">
              Powered by Gemini 3.5 — Ask any technical question about this repository
            </CardDescription>
          </div>
        </CardHeader>

        {/* Chat Feed */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {/* Incoming Msg (Bot) */}
          <div className="flex items-start gap-4">
            <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-primary/20 bg-primary/10 text-primary">
              <AvatarFallback className="text-[10px] font-bold">AI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5 max-w-[80%]">
              <div className="rounded-2xl rounded-tl-none bg-accent/60 px-4 py-3 text-sm text-foreground/90 shadow-xs border border-border/20 leading-relaxed">
                Hi! I&apos;m your AI codebase assistant. I&apos;ve analyzed your repository and can help answer questions about your database schemas, server actions, route security, and file structures.
              </div>
              <span className="text-[10px] text-muted-foreground/80 font-medium px-1">AI Bot • Just now</span>
            </div>
          </div>

          {/* Outgoing Msg (User) */}
          <div className="flex items-start gap-4 ml-auto justify-end">
            <div className="flex flex-col gap-1.5 max-w-[80%] items-end">
              <div className="rounded-2xl rounded-tr-none bg-primary px-4 py-3 text-sm text-primary-foreground shadow-xs leading-relaxed">
                How does the prisma schema connect to our user model?
              </div>
              <span className="text-[10px] text-muted-foreground/80 font-medium px-1">You • 2 mins ago</span>
            </div>
            <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-border bg-accent text-accent-foreground">
              <AvatarFallback className="text-[10px] font-bold">ME</AvatarFallback>
            </Avatar>
          </div>

          {/* Incoming Msg (Bot) */}
          <div className="flex items-start gap-4">
            <Avatar className="h-8 w-8 shrink-0 mt-0.5 border border-primary/20 bg-primary/10 text-primary">
              <AvatarFallback className="text-[10px] font-bold">AI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5 max-w-[80%]">
              <div className="rounded-2xl rounded-tl-none bg-accent/60 px-4 py-3 text-sm text-foreground/90 shadow-xs border border-border/20 leading-relaxed space-y-3">
                <p>
                  In <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">prisma/schema.prisma</code>, the <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">User</code> model is defined with unique attributes:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code className="font-mono text-xs">id String @id</code>: Matches the UUID created during user signup in Supabase.</li>
                  <li><code className="font-mono text-xs">emailAddress String @unique</code>: The authenticated user&apos;s email address.</li>
                  <li><code className="font-mono text-xs">credits Int @default(150)</code>: Current credit balance for running repository reviews.</li>
                </ul>
                <p>
                  When a user logs in, they are inserted into the database using the server action <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">createUserInDbAction(id, email)</code> found in <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">src/app/actions/auth.ts</code>.
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground/80 font-medium px-1">AI Bot • 1 min ago</span>
            </div>
          </div>
        </CardContent>

        {/* Input box */}
        <CardFooter className="p-4 border-t border-border/40 shrink-0 flex flex-col gap-3">
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 w-full">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-accent/30 px-3 py-1 text-xs text-muted-foreground hover:bg-accent/80 hover:text-foreground transition-all duration-200"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {suggestion}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Ask me anything about your project's code..."
              className="flex-1 bg-background/50 border-border/60 focus-visible:ring-1"
            />
            <Button size="icon" className="shrink-0 shadow-md shadow-primary/10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
