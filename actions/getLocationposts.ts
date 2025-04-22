import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

// Função auxiliar para enriquecer os dados após a consulta do Prisma
async function enrichPostData(posts: PostWithExtras[]): Promise<PostWithExtras[]> {
  return posts.map((post) => {
    // Adiciona dados extras ou faz qualquer outro processamento conforme necessário
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
    };
    return enrichedPost;
  });
}

// Função para buscar posts filtrados por localização, categoria e nível de assinatura
export async function getLocationposts(
  subscriptionLevel: "free" | "basic" | "premium",
  userId: string,
  country: string,  // Adiciona o parâmetro 'country'
  city: string,     // Adiciona o parâmetro 'city'
  page: number = 1,  // Página atual, padrão 1
  pageSize: number = 10  // Tamanho da página, padrão 10
): Promise<PostWithExtras[]> {
  // Filtra as categorias permitidas pelo nível de assinatura
  const allowedCategories = {
    premium: ["free", "basic", "premium"],
    basic: ["free", "basic"],
    free: ["free"],
  }[subscriptionLevel];

  try {
    // Buscar posts no banco de dados com a localização específica (country, city)
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { category: { in: allowedCategories } },  // Filtra por categorias permitidas
          { userId: userId },  // Inclui os posts do próprio usuário
        ],
        // Filtros para cidade e país
        AND: [
          { country: { equals: country } },  // Filtro de país
          { city: { equals: city } }  // Filtro de cidade
        ]
      },
      orderBy: {
        createdAt: "desc",  // Ordena os posts pela data de criação em ordem decrescente
      },
      skip: (page - 1) * pageSize,  // Pula os posts com base na página
      take: pageSize,  // Limita ao número de posts da página
      include: {
        comments: { include: { user: true } },  // Inclui detalhes dos comentários
        likes: { include: { user: true } },  // Inclui detalhes das curtidas
        savedBy: true,  // Inclui informações de quem salvou
        user: true,  // Inclui informações do autor do post
      },
    });

    // Se não houver posts, retorna um array vazio
    if (!posts || posts.length === 0) {
      return [];
    }

    // Enriquecendo os dados com informações adicionais
    return enrichPostData(posts);
  } catch (error) {
    console.error("Erro ao buscar posts filtrados:", error);
    throw new Error("Não foi possível buscar os posts.");
  }
}
