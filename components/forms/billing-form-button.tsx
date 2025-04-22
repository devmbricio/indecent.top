
"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps { 
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const priceId = offer.stripeIds[year ? "yearly" : "monthly"];

  // Verifique se `priceId` não é null antes de chamar a função
  const stripeSessionAction = () => {
    if (priceId) {
      startTransition(() => {
        // Não usar `await` aqui
        generateUserStripe(priceId).catch(error => {
          console.error("Erro ao iniciar checkout:", error);
        });
      });
    } else {
      console.error("Price ID is null, unable to initiate checkout.");
    }
  };

  const userOffer =
    subscriptionPlan.stripePriceId === priceId;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}


/* funcional antes do crypto pay


"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps { 
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const priceId = offer.stripeIds[year ? "yearly" : "monthly"];

  // Verifique se `priceId` não é null antes de chamar a função
  const stripeSessionAction = () => {
    if (priceId) {
      startTransition(() => {
        // Não usar `await` aqui
        generateUserStripe(priceId).catch(error => {
          console.error("Erro ao iniciar checkout:", error);
        });
      });
    } else {
      console.error("Price ID is null, unable to initiate checkout.");
    }
  };

  const userOffer =
    subscriptionPlan.stripePriceId === priceId;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}
*/

/* funcional para assinaturas
"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps { 
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const priceId = offer.stripeIds[year ? "yearly" : "monthly"];

  // Verifique se `priceId` não é null antes de chamar a função
  const stripeSessionAction = () => {
    if (priceId) {
      startTransition(() => {
        // Não usar `await` aqui
        generateUserStripe(priceId).catch(error => {
          console.error("Erro ao iniciar checkout:", error);
        });
      });
    } else {
      console.error("Price ID is null, unable to initiate checkout.");
    }
  };

  const userOffer =
    subscriptionPlan.stripePriceId === priceId;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}
*/

/*
"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps { 
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const priceId = offer.stripeIds[year ? "yearly" : "monthly"];

  // Verifique se `priceId` não é null antes de chamar a função
  const stripeSessionAction = () => {
    if (priceId) {
      startTransition(() => {
        // Não usar `await` aqui
        generateUserStripe(priceId).catch(error => {
          console.error("Erro ao iniciar checkout:", error);
        });
      });
    } else {
      console.error("Price ID is null, unable to initiate checkout.");
    }
  };

  const userOffer =
    subscriptionPlan.stripePriceId === priceId;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade"}</>
      )}
    </Button>
  );
}
*/