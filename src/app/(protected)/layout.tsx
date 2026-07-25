import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/_components/Sidebar";
import { getCurrentUserAction, getCurrentDbUserAction } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InvitationModal } from "@/app/_components/invitation-modal";

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
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground dark:scheme-dark">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6 z-10">
          <div className="flex items-center gap-4">
            {/* Custom Logo (Geometric) */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-primary">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wide text-foreground">
                Repo Review
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none mt-0.5">
                v1.0.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <Avatar className="h-9 w-9 border border-border bg-neutral-800 text-white shrink-0">
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
        <div className="flex flex-1 overflow-hidden w-full">
          <AppSidebar user={user} dbUser={dbUser} signOutAction={signOutAction} />
          
          {/* Page Content Panel */}
          <main className="relative flex-1 overflow-y-auto bg-background p-6 md:p-8 scrollbar-hide">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
          
          <InvitationModal />
        </div>
      </div>
    </SidebarProvider>
  );
}