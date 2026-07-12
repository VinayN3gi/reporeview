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
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor code quality, analysis history, and active repositories.
          </p>
        </div>
        <Button className="w-fit shadow-md shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Link New Repository
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/50 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Repositories
            </CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 integrated this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Analyses Performed
            </CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average 12 analyses / week
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Average Code Score
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">81.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Increase of +4.2% since May
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Credits Remaining
            </CardTitle>
            <span className="text-xs">🪙</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {dbUser?.credits ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Refreshes in 18 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Repository list - spans 2 cols */}
        <Card className="md:col-span-2 border-border/60 bg-card/50 backdrop-blur-xs">
          <CardHeader>
            <CardTitle>Recent Repositories</CardTitle>
            <CardDescription>
              A overview of the status and scores from your repository scans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground font-medium">
                    <th className="pb-3 font-semibold">Repository</th>
                    <th className="pb-3 font-semibold">Branch</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Last scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {mockRepos.map((repo) => (
                    <tr key={repo.name} className="hover:bg-accent/30 transition-colors">
                      <td className="py-4 font-medium text-foreground/90 flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        {repo.name}
                      </td>
                      <td className="py-4 font-mono text-xs text-muted-foreground">
                        {repo.branch}
                      </td>
                      <td className="py-4">
                        <Badge
                          variant="outline"
                          className={
                            repo.status === "Healthy"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : repo.status === "Warning"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {repo.status}
                        </Badge>
                      </td>
                      <td className="py-4 font-semibold text-foreground/95">
                        {repo.score}
                      </td>
                      <td className="py-4 text-muted-foreground text-xs">
                        {repo.lastAnalyzed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help & Next Steps */}
        <Card className="border-border/60 bg-card/50 backdrop-blur-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              Got questions about your repository’s code quality, architecture or open issues? Ask our bot!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-accent/40 p-3.5 border border-border/40 text-xs leading-relaxed text-muted-foreground">
              &quot;How can I resolve the memory leaks in the e-commerce-backend develops branch?&quot;
            </div>
            <div className="rounded-lg bg-accent/40 p-3.5 border border-border/40 text-xs leading-relaxed text-muted-foreground">
              &quot;What security vulnerabilities were detected in my dashboard scan?&quot;
            </div>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Link href="/qa" className="w-full">
              <Button variant="outline" className="w-full group">
                Go to Q&A Chat
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
