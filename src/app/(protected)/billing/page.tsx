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
      Billing
    </div>
  );
}
