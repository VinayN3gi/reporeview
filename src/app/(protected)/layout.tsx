import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/_components/Sidebar";
import { getCurrentUserAction, getCurrentDbUserAction } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Coins, Code2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  children: React.ReactNode;
};

export default async function SidebarLayout({ children }: Props) {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect("/signin");
  }

  const dbUser = await getCurrentDbUserAction();

  async function signOutAction() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/signin");
  }

  const userDisplayName = dbUser?.firstname 
    ? `${dbUser.firstname} ${dbUser.lastname ?? ""}`.trim() 
    : user?.email?.split("@")[0] ?? "User";

  const userInitials = dbUser?.firstname && dbUser?.lastname
    ? `${dbUser.firstname[0]}${dbUser.lastname[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() ?? "US";

  return (
    <SidebarProvider className="flex-col h-screen w-screen overflow-hidden bg-background">
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground dark:[color-scheme:dark] p-3 gap-3">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border border-border bg-card/90 px-6 backdrop-blur-md z-10 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <Code2 className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wide bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Repo Review
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none mt-0.5">
                v1.0.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Credits counter */}
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500 border border-amber-500/20">
              <Coins className="h-3.5 w-3.5" />
              <span>{dbUser?.credits ?? 0} Credits</span>
            </div>

            {/* User Avatar */}
            <Avatar className="h-9 w-9 border border-border bg-neutral-800 text-white shrink-0 shadow-sm">
              {dbUser?.imageUrl ? (
                <AvatarImage src={dbUser.imageUrl} alt={userDisplayName} />
              ) : null}
              <AvatarFallback className="text-xs font-extrabold bg-neutral-800 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content & Sidebar Wrapper */}
        <div className="flex flex-1 overflow-hidden w-full gap-3">
          <AppSidebar user={user} dbUser={dbUser} signOutAction={signOutAction} />
          
          {/* Page Content Panel */}
          <main className="flex-1 overflow-y-auto bg-card/90 border border-border rounded-2xl shadow-md p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}