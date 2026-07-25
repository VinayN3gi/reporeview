"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserInDbAction } from "@/app/actions/auth";
import { Mail, Lock, ArrowRight, Loader2, GitBranch, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
      } else if (data.user) {
        const res = await createUserInDbAction(data.user.id, data.user.email!);
        if (!res.success) {
          setError(res.error ?? "Failed to sync user with database.");
          setIsLoading(false);
        } else {
          if (data.session) {
            router.refresh();
            router.push("/dashboard");
          } else {
            setMessage("Registration successful! Please check your email to confirm your account.");
            setIsLoading(false);
          }
        }
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
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/20">
            <GitBranch className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create an account</h1>
            <p className="text-muted-foreground mt-2">Join us and start analyzing your repositories</p>
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-start gap-3 animate-in fade-in zoom-in-95">
                <div className="mt-0.5 font-bold bg-destructive/20 w-5 h-5 rounded-full flex items-center justify-center text-xs">!</div>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}
            {message && (
              <div className="rounded-xl bg-green-500/10 p-4 text-sm text-green-500 border border-green-500/20 flex items-start gap-3 animate-in fade-in zoom-in-95">
                <ShieldCheck className="h-5 w-5 mt-0.5" />
                <p className="leading-relaxed">{message}</p>
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
                <Label htmlFor="password" className="font-semibold text-foreground/80 ml-1">Password</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-11 py-6 bg-background/50 border-input/60 focus:bg-accent/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 rounded-xl text-base shadow-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold text-foreground/80 ml-1">Confirm Password</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Create Account
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center text-base text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary hover:text-primary/80 font-bold transition-colors underline decoration-primary/30 underline-offset-4"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
