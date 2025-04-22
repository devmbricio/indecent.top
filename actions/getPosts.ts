
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

// Função auxiliar para enriquecer os dados após a consulta do Prisma
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
    // Adicione outros campos adicionais aqui conforme necessário
  }));
}

// Função para verificar créditos do usuário
async function checkCredits(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
      },
    });

    if (!user) {
      console.error(`[checkCredits] Usuário não encontrado: ${userId}`);
      throw new Error("Usuário não encontrado");
    }

    return user.credits ?? 0; // Retorna os créditos ou 0 caso não definido
  } catch (error) {
    console.error("[checkCredits] Erro ao verificar créditos:", error);
    throw new Error("Erro ao verificar créditos");
  }
}

// Função principal para buscar e filtrar os posts com base no nível de assinatura e na paginação
export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Página atual, padrão 1
  pageSize: number = 10 // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Verifica os créditos do usuário
    const userCredits = await checkCredits(userId);
    console.log(`[getFilteredPosts] Créditos do usuário: ${userCredits}`);

    if (userCredits <= 0 && subscriptionLevel !== "free") {
      throw new Error("Créditos insuficientes para acessar os posts.");
    }

    // Buscar os posts no banco de dados com paginação
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId }, // Inclui os posts criados pelo próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordena pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Pula os posts com base na página
      take: pageSize, // Limita ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui detalhes dos comentários e usuários
        likes: { include: { user: true } }, // Inclui detalhes das curtidas e usuários
        savedBy: true, // Inclui informações de quem salvou o post
        user: true, // Inclui informações do autor do post
      },
    });

    // Retorna os posts enriquecidos ou um array vazio caso nenhum seja encontrado
    return posts.length > 0 ? await enrichPostData(posts) : [];
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}

export { enrichPostData, checkCredits };


/* antes de filtrar interest
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

// Função auxiliar para enriquecer os dados após a consulta do Prisma
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
    // Adicione outros campos adicionais aqui conforme necessário
  }));
}

// Função para verificar créditos do usuário
async function checkCredits(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
      },
    });

    if (!user) {
      console.error(`[checkCredits] Usuário não encontrado: ${userId}`);
      throw new Error("Usuário não encontrado");
    }

    return user.credits ?? 0; // Retorna os créditos ou 0 caso não definido
  } catch (error) {
    console.error("[checkCredits] Erro ao verificar créditos:", error);
    throw new Error("Erro ao verificar créditos");
  }
}

// Função principal para buscar e filtrar os posts com base no nível de assinatura e na paginação
export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Página atual, padrão 1
  pageSize: number = 10 // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Verifica os créditos do usuário
    const userCredits = await checkCredits(userId);
    console.log(`[getFilteredPosts] Créditos do usuário: ${userCredits}`);

    if (userCredits <= 0 && subscriptionLevel !== "free") {
      throw new Error("Créditos insuficientes para acessar os posts.");
    }

    // Buscar os posts no banco de dados com paginação
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId }, // Inclui os posts criados pelo próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordena pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Pula os posts com base na página
      take: pageSize, // Limita ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui detalhes dos comentários e usuários
        likes: { include: { user: true } }, // Inclui detalhes das curtidas e usuários
        savedBy: true, // Inclui informações de quem salvou o post
        user: true, // Inclui informações do autor do post
      },
    });

    // Retorna os posts enriquecidos ou um array vazio caso nenhum seja encontrado
    return posts.length > 0 ? await enrichPostData(posts) : [];
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}

export { enrichPostData, checkCredits };
*/


/* funcional antes do mostrar creditos na home
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

// Função auxiliar para enriquecer os dados após a consulta do Prisma
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
    // Adicione outros campos adicionais aqui conforme necessário
  }));
}

// Função principal para buscar e filtrar os posts com base no nível de assinatura e na paginação
export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Página atual, padrão 1
  pageSize: number = 10 // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Buscar os posts no banco de dados com paginação
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId }, // Inclui os posts criados pelo próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordena pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Pula os posts com base na página
      take: pageSize, // Limita ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui detalhes dos comentários e usuários
        likes: { include: { user: true } }, // Inclui detalhes das curtidas e usuários
        savedBy: true, // Inclui informações de quem salvou o post
        user: true, // Inclui informações do autor do post
      },
    });

    // Retorna os posts enriquecidos ou um array vazio caso nenhum seja encontrado
    return posts.length > 0 ? await enrichPostData(posts) : [];
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}
*/

/* funcional antes de creditos para visualizacao
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

// Função auxiliar para enriquecer os dados após a consulta do Prisma
async function enrichPostData(posts: PostWithExtras[]): Promise<PostWithExtras[]> {
  return posts.map((post) => {
    // Adicione dados adicionais ou cálculos conforme necessário
    const enrichedPost: PostWithExtras = {
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
      // Outros campos adicionais podem ser processados aqui
    };
    return enrichedPost;
  });
}

// Função principal para buscar e filtrar os posts com base no nível de assinatura e na paginação
export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Página atual, padrão 1
  pageSize: number = 10 // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Buscar os posts no banco de dados com paginação
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId }, // Inclui os posts do próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordena pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Pula os posts com base na página
      take: pageSize, // Limita ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui detalhes dos comentários
        likes: { include: { user: true } }, // Inclui detalhes das curtidas
        savedBy: true, // Inclui informações de quem salvou
        user: true, // Inclui informações do autor do post
      },
    });

    // Se nenhum post for encontrado, retorna um array vazio
    if (!posts || posts.length === 0) {
      return [];
    }

    // Enriquecer os dados do post com informações adicionais
    return enrichPostData(posts);
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}
*/




/*
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Página atual, padrão 1
  pageSize: number = 10 // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Buscar os posts no banco de dados com paginação
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId }, // Inclui os posts do próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordena pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Pula os posts com base na página
      take: pageSize, // Limita ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui detalhes dos comentários
        likes: { include: { user: true } }, // Inclui detalhes das curtidas
        savedBy: true, // Inclui informações de quem salvou
        user: true, // Inclui informações do autor do post
      },
    });

    // Se nenhum post for encontrado, retorna um array vazio
    if (!posts || posts.length === 0) {
      return [];
    }

    // Retorna os posts acumulados
    return posts;
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}
*/


/* funcional antes das tags
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Página atual, padrão 1
  pageSize: number = 10 // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Buscar os posts no banco de dados com paginação
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Filtra por categorias permitidas
          { userId: userId }, // Inclui os posts do próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordena pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Pula os posts com base na página
      take: pageSize, // Limita ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui detalhes dos comentários
        likes: { include: { user: true } }, // Inclui detalhes das curtidas
        savedBy: true, // Inclui informações de quem salvou
        user: true, // Inclui informações do autor do post
      },
    });

    // Se nenhum post for encontrado, retorna um array vazio
    if (!posts || posts.length === 0) {
      return [];
    }

    // Retorna os posts acumulados
    return posts;
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}
*/

/* funcional antes do infinite scroll

import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Adiciona paginação com valor padrão de 1
  pageSize: number = 10 // Define o número de posts por página, padrão 10
): Promise<PostWithExtras[]> {
  // Determina as categorias permitidas com base no nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } }, // Posts que correspondem às categorias permitidas
          { userId: userId }, // Posts do próprio usuário
        ],
      },
      orderBy: {
        createdAt: "desc", // Ordenação por data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize, // Define o offset com base na página
      take: pageSize, // Limita os resultados ao tamanho da página
      include: {
        comments: { include: { user: true } }, // Inclui comentários e informações do usuário
        likes: { include: { user: true } }, // Inclui curtidas e informações do usuário
        savedBy: true, // Inclui usuários que salvaram o post
        user: true, // Inclui informações do autor do post
      },
    });

    return posts;
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}
*/

/*usando swiper nao funcionou


import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  page: number = 1, // Adiciona paginação (opcional)
  pageSize: number = 10 // Quantidade de posts por página (padrão 10)
): Promise<PostWithExtras[]> {
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { category: { in: allowedCategories } },
        { userId: userId },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * pageSize, // Define o offset com base na página
    take: pageSize, // Limita os resultados ao tamanho da página
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}

*/

/*



import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(subscriptionLevel: "free" | "basic" | "premium", userId: string): Promise<PostWithExtras[]> {
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { category: { in: allowedCategories } },
        { userId: userId }, // Inclui posts do próprio usuário
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}
*/


/* 100%
import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(subscriptionLevel: "free" | "basic" | "premium", userId: string): Promise<PostWithExtras[]> {
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { category: { in: allowedCategories } },
        { userId: userId }, // Inclui posts do próprio usuário
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}
  */


/* funcional so mostra posts dos assinantes


import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getFilteredPosts(subscriptionLevel: "free" | "basic" | "premium"): Promise<PostWithExtras[]> {
  // Mapear categorias permitidas por nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  console.log("Subscription Level:", subscriptionLevel);
  console.log("Allowed Categories:", allowedCategories);

  // Consulta no Prisma
  const posts = await prisma.post.findMany({
    where: {
      category: {
        in: allowedCategories, // Filtrar pelas categorias permitidas
      },
    },
    orderBy: {
      createdAt: "desc", // Ordenar por data de criação
    },
    include: {
      comments: {
        include: { user: true },
      },
      likes: {
        include: { user: true },
      },
      savedBy: true,
      user: true,
    },
  });

  console.log("Posts retornados:", posts);

  // Mapeamento para garantir a conformidade com o tipo PostWithExtras
  return posts.map((post) => ({
    id: post.id,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    caption: post.caption,
    fileUrl: post.fileUrl,
    category: post.category,
    userId: post.userId,
    user: {
      id: post.user.id,
      name: post.user.name || "Anônimo",
      username: post.user.username || "usuário",
    },
    comments: post.comments.map((comment) => ({
      id: comment.id,
      body: comment.body || "",
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        name: comment.user.name || "Anônimo",
      },
    })),
    likes: post.likes.map((like) => ({
      id: like.id,
      createdAt: like.createdAt,
      user: {
        id: like.user.id,
        name: like.user.name || "Anônimo",
      },
    })),
    savedBy: post.savedBy.map((save) => ({
      id: save.id,
      createdAt: save.createdAt,
      userId: save.userId,
      postId: save.postId,
    })),
  }));
}
*/

