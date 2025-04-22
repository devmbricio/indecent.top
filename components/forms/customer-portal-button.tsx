"use client";

import { useTransition } from "react";
import { openCustomerPortal } from "@/actions/open-customer-portal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface CustomerPortalButtonProps {
  userStripeId: string;
}

export function CustomerPortalButton({
  userStripeId,
}: CustomerPortalButtonProps) {
  const [isPending, startTransition] = useTransition();

  const stripeSessionAction = () =>
    startTransition(async () => {
      try {
        await openCustomerPortal(userStripeId);
      } catch (error) {
        console.error("Erro ao abrir o portal do cliente:", error);
      }
    });

  return (
    <Button disabled={isPending} onClick={stripeSessionAction}>
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : (
        "Open Customer Portal"
      )}
    </Button>
  );
}
