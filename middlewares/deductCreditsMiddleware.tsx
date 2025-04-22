import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const checkCreditsAndSubscription = async (userId: string, influencerId?: string) => {
  try {
    // Buscar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "Usuário não encontrado.", status: 404 };
    }

    // Verifica assinaturas no Stripe (mesma lógica anterior)
    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });

      const activeSubscription = subscriptions.data[0];
      if (activeSubscription) {
        const priceId = activeSubscription.items.data[0].price.id;
        const subscriptionLevel =
          priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID ||
          priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID
            ? "basic"
            : priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID ||
              priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID
            ? "premium"
            : null;

        if (subscriptionLevel) {
          return { subscriptionLevel, credits: null, error: null };
        }
      }
    }

    // Caso não tenha assinatura ativa, mas o usuário tem créditos
    if (user.credits > 0) {
      // Deduz um crédito
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });

      // Redistribuir crédito
      if (influencerId) {
        await distributeCredits(1, userId, influencerId); // Transferindo o crédito deduzido
      }

      return { subscriptionLevel: "premium", credits: updatedUser.credits, error: null };
    }

    // Caso não tenha créditos nem assinatura, mas deve acessar conteúdo free
    return {
      subscriptionLevel: "free",
      credits: 0,
      error: null,
    };
  } catch (error) {
    console.error("Erro no middleware:", error);
    return { error: "Erro interno no servidor.", status: 500 };
  }
};

const distributeCredits = async (credit: number, userId: string, influencerId: string) => {
  // Calculando percentuais
  const influencerShare = credit * 0.7;
  const affiliateShare = credit * 0.2;
  const adminShare = credit * 0.1;

  try {
    // Buscar o influenciador no banco de dados
    const influencer = await prisma.user.findUnique({
      where: { id: influencerId },
    });

    if (!influencer) {
      throw new Error("Influenciador não encontrado.");
    }

    // Atualizar saldo do influenciador
    await prisma.user.update({
      where: { id: influencerId },
      data: { credits: influencer.credits + influencerShare },
    });

    // Buscar o afiliado (caso exista) com base no userId da sessão
    const affiliateRole = await prisma.user.findUnique({
      where: { id: userId },
      select: { affiliate: true }, // Busca apenas o campo affiliate
    });

    if (affiliateRole?.affiliate === "AFFILIATE") {
      const affiliate = await prisma.user.findUnique({
        where: { id: userId }, // Aqui buscamos o afiliado real
      });

      if (affiliate) {
        // Atualizar saldo do afiliado
        await prisma.user.update({
          where: { id: affiliate.id },
          data: { credits: affiliate.credits + affiliateShare },
        });
      }
    }

    // Atualizar saldo do administrador
    const admin = await prisma.user.findFirst({
      where: { isAdmin: true },
    });

    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { credits: admin.credits + adminShare },
      });
    }
  } catch (error) {
    console.error("Erro na distribuição de créditos:", error);
    throw new Error("Erro ao distribuir créditos.");
  }
};



/* 100% antes da deducao do cliente e insercao no influencer / taxas
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const checkCreditsAndSubscription = async (userId: string) => {
  try {
    // Buscar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "Usuário não encontrado.", status: 404 };
    }

    // Verifica assinaturas no Stripe
    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });

      const activeSubscription = subscriptions.data[0];
      if (activeSubscription) {
        const priceId = activeSubscription.items.data[0].price.id;
        const subscriptionLevel =
          priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID ||
          priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID
            ? "basic"
            : priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID ||
              priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID
            ? "premium"
            : null;

        if (subscriptionLevel) {
          // Retorna se houver uma assinatura ativa
          return { subscriptionLevel, credits: null, error: null };
        }
      }
    }

    // Caso não tenha assinatura ativa, mas o usuário tem créditos
    if (user.credits > 0) {
      // Deduz um crédito
      await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });

      return { subscriptionLevel: "premium", credits: user.credits, error: null };
    }

    // Caso não tenha créditos nem assinatura, mas deve acessar conteúdo free
    return {
      subscriptionLevel: "free",
      credits: 0, // Explicita que o saldo de créditos é zero
      error: null, // Sem erro neste caso, pois conteúdo free é permitido
    };
  } catch (error) {
    console.error("Erro no middleware:", error);
    return { error: "Erro interno no servidor.", status: 500 };
  }
};
*/



/* deduz ok, mas nao permite visulizar conteudo gratis
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const checkCreditsAndSubscription = async (userId: string) => {
  try {
    // Buscar o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "Usuário não encontrado.", status: 404 };
    }

    if (user.stripeCustomerId) {
      // Verifica assinaturas ativas
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });

      const activeSubscription = subscriptions.data[0];
      if (activeSubscription) {
        const priceId = activeSubscription.items.data[0].price.id;
        const subscriptionLevel =
          priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID ||
          priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID
            ? "basic"
            : priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID ||
              priceId === process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID
            ? "premium"
            : null;

        if (subscriptionLevel) {
          return { subscriptionLevel, credits: null, error: null };
        }
      }
    }

    // Caso não tenha assinatura ativa
    if (user.credits <= 0) {
      return {
        error: "Sem créditos suficientes. Recarregue para continuar.",
        status: 403,
      };
    }

    // Deduz um crédito
    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - 1 },
    });

    return { subscriptionLevel: "free", credits: user.credits - 1, error: null };
  } catch (error) {
    console.error("Erro no middleware:", error);
    return { error: "Erro interno no servidor.", status: 500 };
  }
};
*/

/* funcional anterior
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const deductCreditsMiddleware = async (req: Request) => {
  try {
    const userId = (req as any)?.user?.id; // A chave 'user' deve ser adicionada anteriormente no middleware de autenticação

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Sem créditos suficientes. Recarregue para continuar." },
        { status: 403 }
      );
    }

    // Deduzindo um crédito
    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - 1 },
    });

    console.log(`Crédito deduzido com sucesso para o usuário ${userId}`);
    return undefined; // Continua com o fluxo de execução
  } catch (error) {
    console.error("Erro no middleware de dedução de crédito:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
};
*/