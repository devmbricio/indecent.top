"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe"; // Função para gerar sessão do Stripe
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types/types"; // Tipos para as assinaturas
import { Button } from "@/components/ui/button"; // Componente de botão
import { Icons } from "@/components/shared/icons"; // Ícones para UI

interface BillingCryptoFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingCryptoFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingCryptoFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const priceId = offer.stripeIds[year ? "yearly" : "monthly"]; // Seleção do priceId com base na duração da assinatura

  // Função que irá chamar o backend para gerar a sessão de pagamento
  const stripeSessionAction = () => {
    if (!priceId) return;

    startTransition(async () => {
      try {
        await generateUserStripe(priceId); // Passando apenas priceId
      } catch (error) {
        console.error("Erro ao iniciar checkout do Stripe", error);
      }
    });
  };

  const userOffer =
    subscriptionPlan.stripePriceId === priceId; // Verifica se a oferta corresponde ao plano do usuário

  return (
    <Button onClick={stripeSessionAction} disabled={isPending}>
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage Subscription" : "Upgrade with Crypto"}</>
      )}
    </Button>
  );
}
