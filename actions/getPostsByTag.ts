import prisma from "@/lib/prisma";
import { PostWithExtras } from "@/lib/definitions";

export async function getPostsByTag(
    tag: string,
    sort: string = "createdAt",
    page: number = 1,
    pageSize: number = 10
  ): Promise<PostWithExtras[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          tags: { has: tag }, // Filtra por tags
        },
        orderBy: {
          [sort]: "desc", // Ordenação dinâmica
        },
        skip: (page - 1) * pageSize, // Paginação
        take: pageSize,
        include: {
          comments: { include: { user: true } },
          likes: { include: { user: true } },
          savedBy: true,
          user: true,
        },
      });
  
      return posts;
    } catch (error) {
      console.error("Erro ao buscar posts por tag:", error);
      throw new Error("Não foi possível buscar os posts por tag.");
    }
  }
  