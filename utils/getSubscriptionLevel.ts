import { subscriptionPlans } from "@/utils/subscriptionPlans";

export function getSubscriptionLevel(stripeSubscriptionId: string | null): "free" | "basic" | "premium" {
  console.log("Stripe Subscription ID recebido:", stripeSubscriptionId);
  if (!stripeSubscriptionId) return "free";

  for (const planKey in subscriptionPlans) {
    if (planKey === stripeSubscriptionId) {
      console.log("Plano encontrado:", subscriptionPlans[planKey]);
      return subscriptionPlans[planKey].type;
    }
  }

  console.log("Plano não encontrado para o ID:", stripeSubscriptionId);
  return "free"; 
}




/*
// utils/getSubscriptionLevel.ts
import { env } from "@/env.mjs";

export function getSubscriptionLevel(stripeSubscriptionId: string | null): "free" | "basic" | "premium" {
  if (!stripeSubscriptionId) return "free";

  if (
    stripeSubscriptionId === env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID ||
    stripeSubscriptionId === env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID
  ) {
    return "basic";
  }

  if (
    stripeSubscriptionId === env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID ||
    stripeSubscriptionId === env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID
  ) {
    return "premium";
  }

  return "free";
}
*/