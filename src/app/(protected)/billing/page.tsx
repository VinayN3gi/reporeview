import React from "react";
import { getCurrentUserAction, getCurrentDbUserAction } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Check, Shield, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const user = await getCurrentUserAction();
  if (!user) {
    redirect("/signin");
  }

  const dbUser = await getCurrentDbUserAction();

  const pricingPlans = [
    {
      name: "Starter Bundle",
      price: "$19",
      credits: "100 Credits",
      description: "Ideal for individual developers scanning hobby projects.",
      features: [
        "100 Repository scan credits",
        "Prisma/Postgres database check",
        "Basic AI codebase suggestions",
        "Email support",
      ],
      isPopular: false,
      buttonText: "Purchase Starter",
    },
    {
      name: "Professional Bundle",
      price: "$49",
      credits: "350 Credits",
      description: "Best for growing teams and continuous integration pipelines.",
      features: [
        "350 Repository scan credits",
        "In-depth security scans",
        "Full AI chatbot (Gemini 3.5)",
        "Priority Slack support",
        "Collaborative meeting walkthroughs",
      ],
      isPopular: true,
      buttonText: "Upgrade to Professional",
    },
    {
      name: "Enterprise Tier",
      price: "Custom",
      credits: "Unlimited",
      description: "Tailored solutions for compliance and large organizations.",
      features: [
        "Unlimited scans & analyses",
        "Custom compliance reports",
        "Dedicated account manager",
        "On-premise integrations",
        "SLA guarantees",
      ],
      isPopular: false,
      buttonText: "Contact Sales",
    },
  ];

  const transactions = [
    {
      id: "TXN-90142",
      date: "Jul 10, 2026",
      amount: "$49.00",
      credits: "+350 Credits",
      status: "Succeeded",
    },
    {
      id: "TXN-87411",
      date: "Jun 12, 2026",
      amount: "$19.00",
      credits: "+100 Credits",
      status: "Succeeded",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">Manage your plan and view past transactions.</p>
      </div>

      {/* Current balance */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="h-10 w-10 rounded-xl bg-accent-amber/10 flex items-center justify-center border border-accent-amber/20">
          <Coins className="h-5 w-5 text-accent-amber" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current balance</p>
          <p className="text-xl font-bold text-foreground">{dbUser?.credits ?? 0} credits</p>
        </div>
      </div>

      {/* Pricing plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.isPopular
                ? "border-2 border-primary shadow-md relative"
                : "border border-border"
            }
          >
            {plan.isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Most popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-1">{plan.credits}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.isPopular ? "default" : "outline"}>
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Transaction history */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">Transaction history</h3>
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Transaction</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Amount</th>
                <th className="text-left font-medium px-4 py-3">Credits</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{t.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3 text-foreground">{t.amount}</td>
                  <td className="px-4 py-3 text-foreground">{t.credits}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
