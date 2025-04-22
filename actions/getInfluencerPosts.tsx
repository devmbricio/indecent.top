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
 * Função para enriquecer dados do post após a consulta do Prisma.
 */
async function enrichPostData(posts: PostWithExtras[]): Promise<PostWithExtras[]> {
  console.log("[enrichPostData] => Recebidos", posts.length, "posts para enriquecer.");
  return posts.map((post) => ({
    ...post,
    nome: post.nome || null,
    dote: post.dote || null,
    city: post.city || null,
    valor: post.valor || null,
    whatsapp: post.whatsapp || null,
    facebook: post.facebook || null,
    tiktok: post.tiktok || null,
    onlyfans: post.onlyfans || null,
    privacy: post.privacy || null,
  }));
}

/**
 * Verifica assinatura no Stripe ou créditos no banco.
 */
export async function checkCreditsAndSubscription(userId: string) {
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

/**
 * Retorna posts do influenciador SEM deduzir créditos.
 * - Se user for "free" e não tiver créditos => retorna apenas posts "free".
 * - Caso contrário, retorna todos.
 * - Em seguida, enriquece os dados com `enrichPostData`.
 */
export async function getPostsFromProfileNoDeduction(
  profileUserId: string,
  subscriptionLevel: "free" | "basic" | "premium",
  credits: number = 0
): Promise<PostWithExtras[]> {
  console.log("[getPostsFromProfileNoDeduction] =>", {
    profileUserId,
    subscriptionLevel,
    credits,
  });

  // Se "free" e credits=0 => mostra só posts free
  const canViewAll = (subscriptionLevel === "basic" || subscriptionLevel === "premium")
    || (subscriptionLevel === "free" && credits > 0);

  console.log("[getPostsFromProfileNoDeduction] canViewAll =", canViewAll);

  const whereClause = canViewAll
    ? { userId: profileUserId }
    : { userId: profileUserId, category: "free" };

  const rawPosts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  console.log("[getPostsFromProfileNoDeduction] => Encontrados", rawPosts.length, "posts.");

  // Enriquecer antes de retornar
  return enrichPostData(rawPosts);
}


/*

import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { AffiliateRole } from "@prisma/client"; // Enum do Prisma para o tipo de afiliado

// ID do administrador definido no ambiente
const ADMIN_ID = process.env.INDECENT_ADMINISTRADOR;
if (!ADMIN_ID) {
  throw new Error("ID do administrador não configurado. Verifique o .env.");
}

 
async function enrichPostData(posts: PostWithExtras[]): Promise<PostWithExtras[]> {
  return posts.map((post) => ({
    ...post,
    nome: post.nome || null,
    dote: post.dote || null,
    city: post.city || null,
    valor: post.valor || null,
    whatsapp: post.whatsapp || null,
    facebook: post.facebook || null,
    tiktok: post.tiktok || null,
    onlyfans: post.onlyfans || null,
    privacy: post.privacy || null,
  }));
}

 
const distributeCredits = async (credits: number, profileUserId: string) => {
  const influencerShare = credits * 0.7;
  const affiliateShare = credits * 0.2;
  const adminShare = credits * 0.1;

  const influencer = await prisma.user.findUnique({ where: { id: profileUserId } });
  if (!influencer) throw new Error("Influenciador não encontrado.");

  // Verificar se há afiliado no perfil do influenciador
  const isAffiliate = influencer.affiliate === AffiliateRole.AFFILIATE;

  // Redistribuição de 70% para o influenciador
  await prisma.user.update({
    where: { id: profileUserId },
    data: { credits: influencer.credits + influencerShare },
  });

  // Redistribuição de 20% para afiliado ou administrador
  if (isAffiliate) {
    const affiliate = await prisma.user.findUnique({ where: { id: profileUserId } });
    if (affiliate) {
      await prisma.user.update({
        where: { id: profileUserId },
        data: { credits: affiliate.credits + affiliateShare },
      });
    }
  } else {
    const admin = await prisma.user.findUnique({ where: { id: ADMIN_ID } });
    if (admin) {
      await prisma.user.update({
        where: { id: ADMIN_ID },
        data: { credits: admin.credits + affiliateShare },
      });
    }
  }

  // Sempre atribuir 10% ao administrador
  const admin = await prisma.user.findUnique({ where: { id: ADMIN_ID } });
  if (admin) {
    await prisma.user.update({
      where: { id: ADMIN_ID },
      data: { credits: admin.credits + adminShare },
    });
  }
};

 
export async function getPostsFromProfileWithCreditDeduction(
  profileUserId: string,
  viewerId: string,
  viewDurationInMinutes: number
): Promise<PostWithExtras[]> {
  console.log("[getPostsFromProfileWithCreditDeduction] Iniciada =>", {
    profileUserId,
    viewerId,
    viewDurationInMinutes,
  });

  const viewer = await prisma.user.findUnique({ where: { id: viewerId } });
  if (!viewer) {
    console.log("[getPostsFromProfileWithCreditDeduction] Viewer não encontrado => retorna []");
    return [];
  }

  // Se o viewer tiver assinatura, talvez não deduza nada...
  // mas se segue deduzindo, faça:
  const creditsToDeduct = viewDurationInMinutes;

  if (viewer.credits < creditsToDeduct) {
    console.log("[getPostsFromProfileWithCreditDeduction] Créditos insuficientes => retorna posts free do influencer");
    const freePosts = await prisma.post.findMany({
      where: { userId: profileUserId, category: "free" },
      orderBy: { createdAt: "desc" },
    });
    console.log("[getPostsFromProfileWithCreditDeduction] Retornando", freePosts.length, "posts free");
    return freePosts as PostWithExtras[];
  }

  // Viewer tem créditos => debita e exibe todos os posts
  console.log("[getPostsFromProfileWithCreditDeduction] Debitando =>", creditsToDeduct);
  await prisma.user.update({
    where: { id: viewerId },
    data: {
      credits: { decrement: creditsToDeduct },
    },
  });

  console.log("[getPostsFromProfileWithCreditDeduction] Buscando posts do influencer =>", profileUserId);
  const posts = await prisma.post.findMany({
    where: { userId: profileUserId },
    orderBy: { createdAt: "desc" },
  });
  console.log("[getPostsFromProfileWithCreditDeduction] Encontrados:", posts.length, "posts");

  // (Opcional) Se quiser distribuir de imediato, chame distributeCredits, senão não
  // ...

  return posts as PostWithExtras[];
}
 
export const checkCreditsAndSubscription = async (userId: string) => {
  try {
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
          [process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID, process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID].includes(priceId)
            ? "basic"
            : [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID, process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID].includes(priceId)
            ? "premium"
            : null;

        if (subscriptionLevel) {
          return { subscriptionLevel, credits: null, error: null };
        }
      }
    }

    // Se o usuário não tiver uma assinatura ativa, verificar seus créditos
    if (user.credits > 0) {
      return { subscriptionLevel: "premium", credits: user.credits, error: null };
    }

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
*/
/* antes do gpt plus baixa credito mas nao credita 
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { AffiliateRole } from "@prisma/client"; // Enum do Prisma para o tipo de afiliado

// ID do administrador definido no ambiente
const ADMIN_ID = process.env.INDECENT_ADMINISTRADOR;
if (!ADMIN_ID) {
  throw new Error("ID do administrador não configurado. Verifique o .env.");
}

 
async function enrichPostData(posts: PostWithExtras[]): Promise<PostWithExtras[]> {
  return posts.map((post) => ({
    ...post,
    nome: post.nome || null,
    dote: post.dote || null,
    city: post.city || null,
    valor: post.valor || null,
    whatsapp: post.whatsapp || null,
    facebook: post.facebook || null,
    tiktok: post.tiktok || null,
    onlyfans: post.onlyfans || null,
    privacy: post.privacy || null,
  }));
}

 
const distributeCredits = async (credits: number, profileUserId: string) => {
  const influencerShare = credits * 0.7;
  const affiliateShare = credits * 0.2;
  const adminShare = credits * 0.1;

  const influencer = await prisma.user.findUnique({ where: { id: profileUserId } });
  if (!influencer) throw new Error("Influenciador não encontrado.");

  // Verificar se há afiliado no perfil do influenciador
  const isAffiliate = influencer.affiliate === AffiliateRole.AFFILIATE;

  // Redistribuição de 70% para o influenciador
  await prisma.user.update({
    where: { id: profileUserId },
    data: { credits: influencer.credits + influencerShare },
  });

  // Redistribuição de 20% para afiliado ou administrador
  if (isAffiliate) {
    const affiliate = await prisma.user.findUnique({ where: { id: profileUserId } });
    if (affiliate) {
      await prisma.user.update({
        where: { id: profileUserId },
        data: { credits: affiliate.credits + affiliateShare },
      });
    }
  } else {
    const admin = await prisma.user.findUnique({ where: { id: ADMIN_ID } });
    if (admin) {
      await prisma.user.update({
        where: { id: ADMIN_ID },
        data: { credits: admin.credits + affiliateShare },
      });
    }
  }

  // Sempre atribuir 10% ao administrador
  const admin = await prisma.user.findUnique({ where: { id: ADMIN_ID } });
  if (admin) {
    await prisma.user.update({
      where: { id: ADMIN_ID },
      data: { credits: admin.credits + adminShare },
    });
  }
};

 
export async function getPostsFromProfileWithCreditDeduction(
  profileUserId: string,
  viewerId: string,
  viewDurationInMinutes: number,
  page: number = 1,
  pageSize: number = 10
): Promise<PostWithExtras[]> {
  // Calcular os créditos a serem deduzidos
  const creditsToDeduct = viewDurationInMinutes * 1;

  const viewer = await prisma.user.findUnique({ where: { id: viewerId } });
  if (!viewer || viewer.credits < creditsToDeduct) {
    throw new Error("Créditos insuficientes para visualizar posts.");
  }

  const posts = await prisma.post.findMany({
    where: { userId: profileUserId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  if (!posts.length) return [];

  // Deduzir créditos do visualizador
  await prisma.user.update({
    where: { id: viewerId },
    data: { credits: viewer.credits - creditsToDeduct },
  });

  // Redistribuir os créditos
  await distributeCredits(creditsToDeduct, profileUserId);

  return enrichPostData(posts);
}

 
export const checkCreditsAndSubscription = async (userId: string) => {
  try {
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
          [process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PLAN_ID, process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PLAN_ID].includes(priceId)
            ? "basic"
            : [process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_ID, process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_ID].includes(priceId)
            ? "premium"
            : null;

        if (subscriptionLevel) {
          return { subscriptionLevel, credits: null, error: null };
        }
      }
    }

    // Se o usuário não tiver uma assinatura ativa, verificar seus créditos
    if (user.credits > 0) {
      return { subscriptionLevel: "premium", credits: user.credits, error: null };
    }

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
*/