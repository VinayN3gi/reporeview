import { getCurrentUserAction, getCurrentDbUserAction } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, GitPullRequest, ShieldCheck, ArrowRight, Plus, Terminal } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect("/signin");
  }

  const dbUser = await getCurrentDbUserAction();

  // Mock list of repositories for repo-review app context
  const mockRepos = [
    {
      name: "reporeview-app",
      branch: "main",
      status: "Healthy",
      score: "94/100",
      commits: 42,
      lastAnalyzed: "2 hours ago",
    },
    {
      name: "e-commerce-backend",
      branch: "develop",
      status: "Warning",
      score: "78/100",
      commits: 118,
      lastAnalyzed: "1 day ago",
    },
    {
      name: "react-dashboard-sdk",
      branch: "main",
      status: "Critical",
      score: "52/100",
      commits: 14,
      lastAnalyzed: "3 days ago",
    },
  ];

  return (
    <div className="space-y-8">
      Dashboard
    </div>
  );
}
