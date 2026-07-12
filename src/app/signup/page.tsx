"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserInDbAction } from "@/app/actions/auth";

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
            router.push("/");
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 dark:[color-scheme:dark]">
      {/* Dynamic atmospheric gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary-foreground),transparent_50%)] opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-primary),transparent_50%)] opacity-10" />

      <Card className="w-full max-w-md border-foreground/10 bg-card/60 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your email and choose a password to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500 border border-green-500/20">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-input/60 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-input/60 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 border-input/60 focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full font-semibold transition-all duration-300 mt-2 shadow-lg shadow-primary/20"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-primary hover:underline font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
