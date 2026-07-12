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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Purchase scan credits, manage subscription plans, and view transaction history.
        </p>
      </div>

      {/* Credit Summary Card */}
      <Card className="border-amber-500/10 bg-amber-500/5 backdrop-blur-xs border shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">Credit Balance</CardTitle>
              <CardDescription>
                Your remaining credits can be spent on code scans or AI Q&A queries.
              </CardDescription>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-500">
              {dbUser?.credits ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Credits Available</p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Options */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">Purchase Credits</h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3 text-primary" /> Secure payment processing via Stripe
          </span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between border/60 bg-card/50 backdrop-blur-xs relative transition-all duration-300 hover:shadow-lg ${
                plan.isPopular ? "ring-2 ring-primary border-primary/20 scale-[1.02]" : ""
              }`}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-xs text-muted-foreground">one-time</span>}
                </div>
                <div className="text-primary font-bold text-sm mt-1">{plan.credits}</div>
                <CardDescription className="mt-2 text-xs leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-6">
                <Button className="w-full text-xs font-semibold" variant={plan.isPopular ? "default" : "outline"}>
                  {plan.buttonText}
                  <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <Card className="border-border/60 bg-card/50 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Payment History</CardTitle>
          <CardDescription>Records of your credit card purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-accent/20 transition-colors">
                    <td className="py-3 font-medium text-foreground/90 font-mono">{txn.id}</td>
                    <td className="py-3 text-muted-foreground">{txn.date}</td>
                    <td className="py-3 text-foreground font-semibold">{txn.amount}</td>
                    <td className="py-3 text-primary font-medium">{txn.credits}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] px-1.5 py-0">
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
