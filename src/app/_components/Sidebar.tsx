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
import { Bot, CreditCard, LayoutDashboard, Presentation, LogOut, Folder, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  "Project 1",
  "Project 2",
  "Project 3",
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
    <Sidebar collapsible="none" className="border border-border bg-card/55 backdrop-blur-md rounded-2xl shadow-md h-full">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-bold text-muted-foreground/75 tracking-wider uppercase mb-2">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-2">
              {items.map((item) => {
                const isActive = mounted && pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.url} />}
                      className={cn(
                        "w-full transition-all duration-200 h-11 px-4 rounded-xl flex items-center gap-3.5 text-[13.5px]",
                        isActive 
                          ? "!bg-primary !text-primary-foreground hover:!bg-primary/95 hover:!text-primary-foreground shadow-md shadow-primary/10 font-semibold" 
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
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="px-4 text-[11px] font-bold text-muted-foreground/75 tracking-wider uppercase mb-2">
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {projects.map((projectName) => {
                return (
                  <SidebarMenuItem key={projectName}>
                    <SidebarMenuButton
                      tooltip={projectName}
                      render={<Link href="/dashboard" />}
                      className="w-full transition-all duration-200 h-11 px-3 rounded-xl flex items-center gap-3.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground font-medium"
                    >
                      <div 
                        className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold border border-primary bg-primary text-primary-foreground transition-colors shadow-xs"
                      >
                        {projectName.charAt(0)}
                      </div>
                      <span className="truncate text-foreground/90 font-medium text-[13px]">
                        {projectName}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
          
          {/* Create Project Button */}
          <div className="px-2 mt-3">
            <button 
              className="flex items-center gap-2.5 px-4 h-10 border border-border/80 bg-card hover:bg-sidebar-accent text-foreground text-[13px] font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <Plus className="h-4.5 w-4.5 text-muted-foreground" />
              <span>Create Project</span>
            </button>
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with User Details */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-4 mt-auto">
        <div className="flex items-center gap-3 bg-accent/35 p-2.5 rounded-xl border border-border/40">
          <Avatar className="h-10 w-10 border border-primary/10 bg-primary/5 shrink-0">
            {dbUser?.imageUrl ? (
              <AvatarImage src={dbUser.imageUrl} alt={userDisplayName} />
            ) : null}
            <AvatarFallback className="text-xs font-extrabold bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-foreground/90 truncate leading-snug">
              {userDisplayName}
            </span>
            <span className="text-[10px] text-muted-foreground truncate leading-normal">
              {user?.email}
            </span>
          </div>
          <form action={signOutAction} className="shrink-0">
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}