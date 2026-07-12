import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  async function signOutAction() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 dark:[color-scheme:dark]">
      {/* Atmospheric backdrop gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary-foreground),transparent_50%)] opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-primary),transparent_50%)] opacity-10" />

      <Card className="w-full max-w-lg border-foreground/10 bg-card/60 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2 text-primary">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Welcome to Repo Review
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            You have successfully authenticated using Supabase Auth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-foreground/5 bg-background/40 p-4 space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-foreground/5 pb-2">
              <span className="text-muted-foreground font-medium">Email Address</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-foreground/5 pb-2">
              <span className="text-muted-foreground font-medium">User ID</span>
              <span className="font-mono text-xs">{user.id}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Last Sign In</span>
              <span className="font-semibold">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <form action={signOutAction} className="w-full">
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full font-semibold border-destructive/20 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              Sign Out
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
