/* 
  EXEMPLO de arquivo "app/actions/getInfluencerPosts.ts"

  Ele contém:
  1) A verificação do ADMIN_ID
  2) A função enrichPostData
  3) checkCreditsAndSubscription
  4) getPostsFromProfileNoDeduction
*/

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PostWithExtras } from "@/lib/definitions";

// ID do administrador definido no ambiente
const ADMIN_ID = process.env.INDECENT_ADMINISTRADOR;
if (!ADMIN_ID) {
  throw new Error("ID do administrador não configurado. Verifique o .env.");
}

/**
 * Verifica assinatura no Stripe ou créditos no banco.
 */
export async function checkCreditsAndSubscriptions(userId: string) {
  console.log("[checkCreditsAndSubscription] => userId =", userId);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.log("[checkCreditsAndSubscription] user não encontrado => 404");
      return { error: "Usuário não encontrado.", status: 404 };
    }

    // 1) Verifica assinaturas no Stripe
    if (user.stripeCustomerId) {
      console.log("[checkCreditsAndSubscription] user tem stripeCustomerId =>", user.stripeCustomerId);

      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });
      const activeSubscription = subscriptions.data[0];
      if (activeSubscription) {
        const priceId = activeSubscription.items.data[0].price.id;
        console.log("[checkCreditsAndSubscription] Subscription ativa => priceId =", priceId);

        // Decide se é basic ou premium
        const subscriptionLevel =
          [process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID, process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID].includes(priceId)
            ? "basic"
            : [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID, process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID].includes(priceId)
            ? "premium"
            : null;

        if (subscriptionLevel) {
          console.log("[checkCreditsAndSubscription] => subscriptionLevel =", subscriptionLevel);
          return { subscriptionLevel, credits: null, error: null };
        }
      }
    }

    // 2) Se não tiver assinatura, mas tiver créditos => "premium"
    if (user.credits > 0) {
      console.log("[checkCreditsAndSubscription] user.credits =", user.credits, "=> premium");
      return { subscriptionLevel: "premium", credits: user.credits, error: null };
    }

    // 3) Se não tem assinatura nem créditos => free
    console.log("[checkCreditsAndSubscription] => free (0 créditos e sem assinatura)");
    return { subscriptionLevel: "free", credits: 0, error: null };

  } catch (error) {
    console.error("[checkCreditsAndSubscription] Erro =>", error);
    return { error: "Erro interno no servidor.", status: 500 };
  }
}
