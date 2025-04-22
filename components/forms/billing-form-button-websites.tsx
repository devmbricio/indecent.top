import { useTransition } from "react";
import { generateUserStripeSales } from "@/actions/generate-user-stripe-sales";
import { WebsitesPlan } from "@/types/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonWebsitesProps {
  offer: WebsitesPlan;
}

export function BillingFormButtonWebsites({ offer }: BillingFormButtonWebsitesProps) {
  const [isPending, startTransition] = useTransition();

  const stripeSessionAction = async () => {
    startTransition(async () => {
      try {
        const stripeId = offer.stripeIds.yearly;
        if (stripeId) {
          const result = await generateUserStripeSales(stripeId);
          if (result.status === "success" && result.stripeUrl) {
            console.log("Abrindo checkout para:", offer.title);
            window.location.href = result.stripeUrl; // Redirect for client component
          } else {
            throw new Error("Failed to generate Stripe session.");
          }
        } else {
          throw new Error("ID do Stripe não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao iniciar checkout:", (error as Error).message);
      }
    });
  };
  
  

  return (
    <Button
      variant="default"
      //rounded="full"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>Comprar</>
      )}
    </Button>
  );
}



