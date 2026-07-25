"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboard, Presentation, LogOut, Folder, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
];

interface UserProps {
  email?: string;
}

interface DbUserProps {
  firstname?: string | null;
  lastname?: string | null;
  imageUrl?: string | null;
}

interface AppSidebarProps {
  user: UserProps | null;
  dbUser: DbUserProps | null;
  signOutAction: (formData?: FormData) => Promise<void>;
}

export default function AppSidebar({ user, dbUser, signOutAction }: AppSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { projects, projectId, setProjectId, isLoading } = useProject();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const userDisplayName = dbUser?.firstname 
    ? `${dbUser.firstname} ${dbUser.lastname ?? ""}`.trim() 
    : user?.email?.split("@")[0] ?? "User";

  const userInitials = dbUser?.firstname && dbUser?.lastname
    ? `${dbUser.firstname[0]}${dbUser.lastname[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() ?? "US";

  return (
    <Sidebar collapsible="none" className="border-r border-border bg-background h-full">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-bold text-muted-foreground tracking-widest uppercase mb-2">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {items.map((item) => {
                const isActive = mounted && pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.url} />}
                      className={cn(
                        "w-full transition-all duration-200 h-10 px-4 rounded-xl flex items-center gap-4 text-sm",
                        isActive 
                          ? "bg-primary! text-primary-foreground! hover:bg-primary/95! hover:text-primary-foreground! shadow-md shadow-primary/10 font-bold" 
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Your Projects Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-xs font-bold text-muted-foreground tracking-widest uppercase mb-2">
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {isLoading ? (
                <div className="flex flex-col gap-2 p-2">
                  <div className="h-6 bg-muted animate-pulse rounded-lg w-full" />
                  <div className="h-6 bg-muted animate-pulse rounded-lg w-3/4" />
                  <div className="h-6 bg-muted animate-pulse rounded-lg w-5/6" />
                </div>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => {
                  const isActive = project.id === projectId;
                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        tooltip={project.name}
                        render={<Link href="/dashboard" />}
                        onClick={() => setProjectId(project.id)}
                        className={cn(
                          "w-full transition-all duration-200 h-10 px-3 rounded-xl flex items-center gap-4 cursor-pointer",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground text-muted-foreground font-medium"
                        )}
                      >
                        <div 
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold border transition-colors shadow-sm",
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted text-muted-foreground"
                          )}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate text-foreground/90 text-sm">
                          {project.name}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground/60 px-4 py-2">
                  No projects linked
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
          
          {/* Create Project Button */}
          <div className="px-2 mt-4">
            <Link href="/create" className="w-full block">
              <button 
                className="flex items-center gap-2 w-full px-4 h-10 border border-border/80 bg-card hover:bg-sidebar-accent text-foreground text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer hover:shadow-md"
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span>Create Project</span>
              </button>
            </Link>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with User Details */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-4 mt-auto">
        <div className="flex items-center gap-4 bg-accent/35 p-3 rounded-xl border border-border/40 hover:bg-accent/50 transition-colors">
          <Avatar className="h-10 w-10 border border-primary/10 bg-primary/5 shrink-0">
            {dbUser?.imageUrl ? (
              <AvatarImage src={dbUser.imageUrl} alt={userDisplayName} />
            ) : null}
            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold text-foreground/90 truncate leading-snug">
              {userDisplayName}
            </span>
            <span className="text-xs text-muted-foreground truncate leading-normal">
              {user?.email}
            </span>
          </div>
          <form action={async (formData) => {
            setIsLoggingOut(true);
            try {
              await signOutAction(formData);
            } catch {
              setIsLoggingOut(false);
            }
          }} className="shrink-0">
            <Button 
              type="submit" 
              disabled={isLoggingOut}
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus:ring-2 focus:ring-destructive/20"
            >
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}