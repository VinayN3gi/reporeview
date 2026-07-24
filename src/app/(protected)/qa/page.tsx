"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";
import { askQuestion } from "@/lib/action";
import { useProject } from "@/hooks/use-project";
import dynamic from "next/dynamic";

const MDEditorMarkdown = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function QaPage() {
  const { project, projectId } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Explain user auth integration",
    "Where is Prisma database initialized?",
    "Find potential security issues in layout",
    "How does the GitHub repo loader work?",
  ];

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, presetQuestion?: string) => {
    if (e) e.preventDefault();
    const query = presetQuestion || input;
    if (!query.trim() || !projectId) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await askQuestion(query, projectId);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: "ai", content: answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -my-6 md:-my-8 bg-transparent overflow-hidden animate-in fade-in duration-500">
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-background/30"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-4 duration-700 pt-20 md:pt-32 pb-8">
            <div className="relative group flex flex-col items-center justify-center">
              <div className="flex h-24 w-32 rounded-lg border border-border/60 bg-card shadow-sm items-start p-3 overflow-hidden transition-all duration-500 hover:shadow-md hover:border-primary/30">
                <div className="flex flex-col gap-2 w-full">
                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="h-2 w-2 rounded-full bg-destructive/60" />
                    <div className="h-2 w-2 rounded-full bg-accent-amber/60" />
                    <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                  </div>
                  {/* Mock Code Lines */}
                  <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/20" />
                  <div className="h-1.5 w-1/2 rounded-full bg-muted-foreground/20" />
                  {/* Typing Cursor */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-mono text-primary font-bold">{">"}</span>
                    <span className="inline-block w-1.5 h-3 bg-primary animate-pulse" />
                  </div>
                </div>
              </div>
              {/* Subtle Background Glow */}
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">How can I help you today?</h2>
              <p className="text-muted-foreground">I have indexed this repository and can answer detailed technical questions about the architecture, logic, and dependencies.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-8">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(undefined, suggestion)}
                  className="p-4 text-left border border-border/50 rounded-2xl bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <p className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">{suggestion}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "ai" && (
                  <Avatar className="h-8 w-8 mt-1 shadow-sm border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`relative px-5 py-3.5 max-w-[85%] rounded-2xl ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm shadow-md shadow-primary/20" 
                    : "bg-card border border-border/50 text-foreground rounded-tl-sm shadow-sm"
                }`}>
                  {msg.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none" data-color-mode="light">
                      <MDEditorMarkdown source={msg.content} style={{ background: 'transparent' }} />
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1 shadow-sm border border-border">
                    <AvatarFallback className="bg-muted text-muted-foreground"><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-in fade-in">
                <Avatar className="h-8 w-8 mt-1 shadow-sm border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="px-5 py-4 bg-card border border-border/50 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">Analyzing repository...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-2 md:p-3 bg-background/80 backdrop-blur-lg border-t border-border/50">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2 bg-card border border-border rounded-xl p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask a question about the repository... (Press Enter to send)"
            rows={1}
            className="flex-1 max-h-32 min-h-[36px] resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none scrollbar-thin"
            style={{ height: '36px' }}
            disabled={isLoading || !projectId}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading || !projectId}
            className="h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-1.5">
          AI can make mistakes. Verify information against the actual source code.
        </p>
      </div>
    </div>
  );
}
