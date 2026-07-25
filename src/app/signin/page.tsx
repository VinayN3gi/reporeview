"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Loader2, GitBranch } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [message, setMessage] = useState<string | null>(searchParams.get("message"));
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
      } else {
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 dark:scheme-dark relative overflow-hidden">
      {/* Dynamic atmospheric gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary-foreground),transparent_80%)] opacity-20" />
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/20">
            <GitBranch className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-start gap-3 animate-in fade-in zoom-in-95">
                <div className="mt-0.5 font-bold bg-destructive/20 w-5 h-5 rounded-full flex items-center justify-center text-xs">!</div>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}
            {message && (
              <div className="rounded-xl bg-green-500/10 p-4 text-sm text-green-500 border border-green-500/20 animate-in fade-in zoom-in-95">
                {message}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-foreground/80 ml-1">Email address</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-11 py-6 bg-background/50 border-input/60 focus:bg-accent/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 rounded-xl text-base shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="font-semibold text-foreground/80">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-11 py-6 bg-background/50 border-input/60 focus:bg-accent/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 rounded-xl text-base shadow-sm"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full h-14 rounded-xl font-bold text-base transition-all duration-300 shadow-[0_4px_20px_0_rgba(100,100,255,0.25)] hover:shadow-[0_8px_30px_rgba(100,100,255,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center text-base text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 font-bold transition-colors underline decoration-primary/30 underline-offset-4"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground dark:scheme-dark">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <SignInForm />
    </React.Suspense>
  );
}
