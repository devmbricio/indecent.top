
import { unstable_noStore as noStore } from "next/cache";
import type { PostWithExtras } from "@/lib/definitions";
import { Prisma } from "@prisma/client"; // Importar Prisma e PrismaClient
import { UserWithExtras } from "@/lib/definitions";

export const fetchLiveDetails = async (id: string) => {
  try {
    const response = await fetch(`/api/live/${id}`);
    if (!response.ok) {
      console.error(`❌ Live não encontrada para ID: ${id}`);
      return null;
    }
    const data = await response.json();
    return data; // Retorna todos os dados da live, incluindo a streamKey
  } catch (error) {
    console.error("❌ Erro ao buscar a live:", error);
    return null;
  }
};


export async function fetchAllPosts() {
  return prisma.post.findMany({
    select: {
      id: true,
      updatedAt: true,
      user: {
        select: { id: true },
      },
    },
  });
}


export async function getAllLocations() {
  try {
    const locations = await prisma.post.findMany({
      select: {
        country: true,
        city: true,
      },
      distinct: ["country", "city"], // Garante que não haverá duplicatas
    });

    // Normaliza os valores para evitar problemas com 'null'
    return locations
      .filter((location) => location.country && location.city) // Remove locais inválidos
      .map((location) => ({
        country: location.country?.toLowerCase() || "desconhecido",
        city: location.city?.toLowerCase() || "desconhecido",
      }));
  } catch (error) {
    console.error("Erro ao buscar localidades:", error);
    throw new Error("Erro ao buscar localidades");
  }
}



export const fetchUserCredits = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("userId é inválido.");
    }

    // Buscando informações do usuário afiliado diretamente no banco
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,  // Seleciona o campo 'credits' diretamente
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // Verifica e retorna os créditos do usuário
    return user.credits || 0;  // Se o usuário não tiver créditos definidos, retorna 0.
  } catch (error: any) {
    console.error("Erro ao buscar créditos do afiliado:", error.message || error);
    throw new Error("Erro ao carregar créditos: " + (error.message || error));
  }
};


export async function fetchPostsForLocation(city: string, country: string, limit: number) {
  return await prisma.post.findMany({
    where: { 
      city: { equals: city, mode: "insensitive" }, // Busca insensível a maiúsculas/minúsculas
      country: { equals: country, mode: "insensitive" }, // Busca insensível a maiúsculas/minúsculas
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: true,
      comments: true,
      likes: true,
    },
  });
}


export async function fetchUserSubscriptionAndCredits(userId: string) {
  const res = await fetch(`/api/user-status`, {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("Erro ao buscar dados do usuário:", res.statusText);
    return { subscriptionLevel: "free", credits: 0 }; // Fallback padrão
  }

  const { subscriptionLevel, credits } = await res.json();
  return { subscriptionLevel, credits };
}


export async function fetchPostsByAffiliate(subscriptionLevel: "free" | "basic" | "premium" | null) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category:
          subscriptionLevel === "premium"
            ? { in: ["basic", "premium"] }
            : subscriptionLevel === "basic"
            ? "basic"
            : "free",
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    return posts.filter((post) => post.user.affiliate === "AFFILIATE");
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return [];
  }
}


export async function fetchPostsByTag(tag: string, sort: string) {
  const response = await fetch(`/api/tags?tag=${tag}&sort=${sort}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar posts por tag.");
  }

  const data = await response.json();
  return data || [];
}


export async function fetchPosts(subscriptionLevel: "free" | "basic" | "premium" | null): Promise<PostWithExtras[]> {
  return prisma.post.findMany({
    where: {
      OR: [
        { category: "free" },
        subscriptionLevel === "basic" ? { category: "basic" } : undefined,
        subscriptionLevel === "premium" ? { category: { in: ["basic", "premium"] } } : undefined,
      ].filter(Boolean) as Prisma.PostWhereInput[],
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
    },
  });
}


export async function fetchPostsById(id: string) {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchProfile(username: string): Promise<UserWithExtras> {
  const profile = await prisma.user.findFirst({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              socials: true, // Inclua o campo socials corretamente
              name: true,
              username: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
          savedBy: true,
        },
      },
      saved: {
        orderBy: { createdAt: "desc" },
      },
      followedBy: {
        include: {
          follower: {
            include: {
              following: true,
              followedBy: true,
            },
          },
        },
      },
      following: {
        include: {
          following: {
            include: {
              following: true,
              followedBy: true,
            },
          },
        },
      },
      socials: true, // Inclua os dados de redes sociais diretamente na consulta
    },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  const formattedSocials = profile.socials
    ? {
        indecent: profile.socials.indecent || null,
        whatsapp: profile.socials.whatsapp || null,
        instagram: profile.socials.instagram || null,
        tiktok: profile.socials.tiktok || null,
        facebook: profile.socials.facebook || null,
        pinterest: profile.socials.pinterest || null,
        twitter: profile.socials.twitter || null,
        youtube: profile.socials.youtube || null,
        onlyfans: profile.socials.onlyfans || null,
        privacySocial: profile.socials.privacySocial || null,
      }
    : {};

    
  return {
    ...profile,
    verifiedProfile:
      profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
    subscriptionLevel: "free", // Ajuste conforme necessário
    socials: formattedSocials,
    posts: profile.posts || [],
    saved: profile.saved || [],
    reels: "string",
    referralId: profile.referralId || "",
    followedBy: profile.followedBy?.map((follower) => ({
      ...follower,
      follower: {
        ...follower.follower,
        following: [],
        followedBy: [],
        password: follower.follower.password || "",
        bio: null,
        website: null,
        gender: null,
        email: null,
        emailVerified: null,
        privacy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        credits: 0,
        role: "USER",
        verificationPurchased: false,
        postsThisMonth: 0,
        socials: {},
        isAdmin: false,
      },
    })) || [],
    following: profile.following?.map((following) => ({
      ...following,
      following: {
        ...following.following,
        following: [],
        followedBy: [],
        password: following.following.password || "", 
        bio: null,
        website: null,
        gender: null,
        email: null,
        emailVerified: null,
        privacy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        credits: 0,
        role: "USER",
        verificationPurchased: false,
        postsThisMonth: 0,
        socials: {},
        isAdmin: false,
      },
    })) || [],
  };
}



export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch saved posts");
  }
}

export async function fetchUserPurchases(userId: string) {
  // Simular dados de compras
  return [
    { id: "1", productName: "Curso Avançado", date: "2024-10-10", amount: 199.99 },
    { id: "2", productName: "E-book de Fotografia", date: "2024-08-15", amount: 49.99 },
  ];
}

export async function fetchUserSubscriptions(userId: string) {
  // Simular dados de assinaturas
  return [
    { id: "1", planName: "Premium", isActive: true, expiryDate: "2024-12-31" },
    { id: "2", planName: "Basic", isActive: false, expiryDate: "2024-06-30" },
  ];
}

export async function fetchPostsByCategory(category: string, limit: number) {
  return await prisma.post.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function fetchPostsByUserId(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}

type Story = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export async function fetchStoriesByUserId(userId: string, limit: number) {
  return prisma.story.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      videoUrl: true,
      thumbnailUrl: true,
    },
  });
}


import prisma from "@/lib/prisma";

export async function fetchUserSocials(userId: string): Promise<Record<string, string | undefined>> {
  console.log("Buscando redes sociais para o usuário:", userId); // Log inicial

  const socials = await prisma.socials.findUnique({
    where: { userId },
    select: {
      indecent: true,
      whatsapp: true,
      instagram: true,
      tiktok: true,
      facebook: true,
      pinterest: true,
      twitter: true,
      youtube: true,
      onlyfans: true,
      privacySocial: true,
    },
  });

  console.log("Resultado da busca de redes sociais:", socials); // Log do resultado

  return socials
    ? Object.fromEntries(
        Object.entries(socials).map(([key, value]) => [key, value ?? undefined])
      )
    : {};
}




export async function updateUserSocials(userId: string, socials: Record<string, string | undefined>) {
  try {
    const updatedSocials = await prisma.socials.upsert({
      where: { userId },
      update: socials,
      create: { ...socials, userId },
    });
    return updatedSocials;
  } catch (error) {
    console.error("Erro ao atualizar redes sociais:", error);
    throw new Error("Erro ao atualizar redes sociais.");
  }
}

/* funcional antes da pagina publica mostrar socials
import { unstable_noStore as noStore } from "next/cache";
import type { PostWithExtras } from "@/lib/definitions";
import { Prisma } from "@prisma/client"; // Importar Prisma e PrismaClient
import { UserWithExtras } from "@/lib/definitions";


export const fetchUserCredits = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("userId é inválido.");
    }

    // Buscando informações do usuário afiliado diretamente no banco
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,  // Seleciona o campo 'credits' diretamente
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // Verifica e retorna os créditos do usuário
    return user.credits || 0;  // Se o usuário não tiver créditos definidos, retorna 0.
  } catch (error: any) {
    console.error("Erro ao buscar créditos do afiliado:", error.message || error);
    throw new Error("Erro ao carregar créditos: " + (error.message || error));
  }
};


export async function fetchPostsForLocation(city: string, country: string, limit: number) {
  return await prisma.post.findMany({
    where: { 
      city: { equals: city, mode: "insensitive" }, // Busca insensível a maiúsculas/minúsculas
      country: { equals: country, mode: "insensitive" }, // Busca insensível a maiúsculas/minúsculas
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: true,
      comments: true,
      likes: true,
    },
  });
}


export async function fetchUserSubscriptionAndCredits(userId: string) {
  const res = await fetch(`/api/user-status`, {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("Erro ao buscar dados do usuário:", res.statusText);
    return { subscriptionLevel: "free", credits: 0 }; // Fallback padrão
  }

  const { subscriptionLevel, credits } = await res.json();
  return { subscriptionLevel, credits };
}


export async function fetchPostsByAffiliate(subscriptionLevel: "free" | "basic" | "premium" | null) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category:
          subscriptionLevel === "premium"
            ? { in: ["basic", "premium"] }
            : subscriptionLevel === "basic"
            ? "basic"
            : "free",
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    return posts.filter((post) => post.user.affiliate === "AFFILIATE");
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return [];
  }
}


export async function fetchPostsByTag(tag: string, sort: string) {
  const response = await fetch(`/api/tags?tag=${tag}&sort=${sort}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar posts por tag.");
  }

  const data = await response.json();
  return data || [];
}


export async function fetchPosts(subscriptionLevel: "free" | "basic" | "premium" | null): Promise<PostWithExtras[]> {
  return prisma.post.findMany({
    where: {
      OR: [
        { category: "free" },
        subscriptionLevel === "basic" ? { category: "basic" } : undefined,
        subscriptionLevel === "premium" ? { category: { in: ["basic", "premium"] } } : undefined,
      ].filter(Boolean) as Prisma.PostWhereInput[],
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
    },
  });
}


export async function fetchPostsById(id: string) {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchProfile(username: string): Promise<UserWithExtras> {
  const profile = await prisma.user.findFirst({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              socials: true, // Inclua o campo socials corretamente
              name: true,
              username: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                },
              },
            },
          },
          likes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
          savedBy: true,
        },
      },
      saved: {
        orderBy: { createdAt: "desc" },
      },
      followedBy: {
        include: {
          follower: {
            include: {
              following: true,
              followedBy: true,
            },
          },
        },
      },
      following: {
        include: {
          following: {
            include: {
              following: true,
              followedBy: true,
            },
          },
        },
      },
      socials: true, // Inclua os dados de redes sociais diretamente na consulta
    },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return {
    ...profile,
    verifiedProfile:
      profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
    subscriptionLevel: "free", // Ajuste conforme necessário
    socials: {
      indecent: profile.socials?.indecent || null,
      whatsapp: profile.socials?.whatsapp || null,
      instagram: profile.socials?.instagram || null,
      tiktok: profile.socials?.tiktok || null,
      facebook: profile.socials?.facebook || null,
      pinterest: profile.socials?.pinterest || null,
      twitter: profile.socials?.twitter || null,
      youtube: profile.socials?.youtube || null,
      onlyfans: profile.socials?.onlyfans || null,
      privacySocial: profile.socials?.privacySocial || null,
    },
    posts: profile.posts || [],
    saved: profile.saved || [],
    reels: "string",
    referralId: profile.referralId || "",
    followedBy: profile.followedBy?.map((follower) => ({
      ...follower,
      follower: {
        ...follower.follower,
        following: [],
        followedBy: [],
        password: null,
        bio: null,
        website: null,
        gender: null,
        email: null,
        emailVerified: null,
        privacy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        credits: 0,
        role: "USER",
        verificationPurchased: false,
        postsThisMonth: 0,
        socials: {},
        isAdmin: false,
      },
    })) || [],
    following: profile.following?.map((following) => ({
      ...following,
      following: {
        ...following.following,
        following: [],
        followedBy: [],
        password: null,
        bio: null,
        website: null,
        gender: null,
        email: null,
        emailVerified: null,
        privacy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        credits: 0,
        role: "USER",
        verificationPurchased: false,
        postsThisMonth: 0,
        socials: {},
        isAdmin: false,
      },
    })) || [],
  };
}



export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch saved posts");
  }
}

export async function fetchUserPurchases(userId: string) {
  // Simular dados de compras
  return [
    { id: "1", productName: "Curso Avançado", date: "2024-10-10", amount: 199.99 },
    { id: "2", productName: "E-book de Fotografia", date: "2024-08-15", amount: 49.99 },
  ];
}

export async function fetchUserSubscriptions(userId: string) {
  // Simular dados de assinaturas
  return [
    { id: "1", planName: "Premium", isActive: true, expiryDate: "2024-12-31" },
    { id: "2", planName: "Basic", isActive: false, expiryDate: "2024-06-30" },
  ];
}

export async function fetchPostsByCategory(category: string, limit: number) {
  return await prisma.post.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function fetchPostsByUserId(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}

type Story = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export async function fetchStoriesByUserId(userId: string, limit: number) {
  return prisma.story.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      videoUrl: true,
      thumbnailUrl: true,
    },
  });
}


import prisma from "@/lib/prisma";

export async function fetchUserSocials(userId: string): Promise<Record<string, string | undefined>> {
  console.log("Buscando redes sociais para o usuário:", userId); // Log inicial

  const socials = await prisma.socials.findUnique({
    where: { userId },
    select: {
      indecent: true,
      whatsapp: true,
      instagram: true,
      tiktok: true,
      facebook: true,
      pinterest: true,
      twitter: true,
      youtube: true,
      onlyfans: true,
      privacySocial: true,
    },
  });

  console.log("Resultado da busca de redes sociais:", socials); // Log do resultado

  return socials
    ? Object.fromEntries(
        Object.entries(socials).map(([key, value]) => [key, value ?? undefined])
      )
    : {};
}




export async function updateUserSocials(userId: string, socials: Record<string, string | undefined>) {
  try {
    const updatedSocials = await prisma.socials.upsert({
      where: { userId },
      update: socials,
      create: { ...socials, userId },
    });
    return updatedSocials;
  } catch (error) {
    console.error("Erro ao atualizar redes sociais:", error);
    throw new Error("Erro ao atualizar redes sociais.");
  }
}
*/

/*
export async function fetchProfile(username: string) {
  noStore();

  try {
    const data = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        saved: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      // Retorna um objeto vazio ou uma mensagem clara de perfil não encontrado
      return {
        error: "Profile not found",
        verifiedProfile: "NOTVERIFIED",
        posts: [],
        saved: [],
        followedBy: [],
        following: [],
      };
    }

    // Validar o campo verifiedProfile
    const verifiedProfile =
      data.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED";

    // Retornar os dados com o campo validado
    return {
      ...data,
      verifiedProfile,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: "Failed to fetch profile",
      verifiedProfile: "NOTVERIFIED",
      posts: [],
      saved: [],
      followedBy: [],
      following: [],
    };
  }
}
*/


/*
export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch saved posts");
  }
}

export async function fetchUserPurchases(userId: string) {
  // Simular dados de compras
  return [
    { id: "1", productName: "Curso Avançado", date: "2024-10-10", amount: 199.99 },
    { id: "2", productName: "E-book de Fotografia", date: "2024-08-15", amount: 49.99 },
  ];
}

export async function fetchUserSubscriptions(userId: string) {
  // Simular dados de assinaturas
  return [
    { id: "1", planName: "Premium", isActive: true, expiryDate: "2024-12-31" },
    { id: "2", planName: "Basic", isActive: false, expiryDate: "2024-06-30" },
  ];
}

export async function fetchPostsByCategory(category: string, limit: number) {
  return await prisma.post.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function fetchPostsByUserId(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}

type Story = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export async function fetchStoriesByUserId(userId: string, limit: number) {
  return prisma.story.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      videoUrl: true,
      thumbnailUrl: true,
    },
  });
}


import prisma from "@/lib/prisma";

export async function fetchUserSocials(userId: string): Promise<Record<string, string | undefined>> {
  const socials = await prisma.socials.findUnique({
    where: { userId },
    select: {
      indecent: true,
      whatsapp: true,
      instagram: true,
      tiktok: true,
      facebook: true,
      pinterest: true,
      twitter: true,
      youtube: true,
      onlyfans: true,
      privacySocial: true,
    },
  });

  return socials
    ? Object.fromEntries(
        Object.entries(socials).map(([key, value]) => [key, value ?? undefined])
      )
    : {};
}



export async function updateUserSocials(userId: string, socials: Record<string, string | undefined>) {
  try {
    const updatedSocials = await prisma.socials.upsert({
      where: { userId },
      update: socials,
      create: { ...socials, userId },
    });
    return updatedSocials;
  } catch (error) {
    console.error("Erro ao atualizar redes sociais:", error);
    throw new Error("Erro ao atualizar redes sociais.");
  }
}

/*
import { unstable_noStore as noStore } from "next/cache";
import type { PostWithExtras } from "@/lib/definitions";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";


export async function fetchPosts(subscriptionLevel: "free" | "basic" | "premium" | null): Promise<PostWithExtras[]> {
  return prisma.post.findMany({
    where: {
      OR: [
        { category: "free" },
        subscriptionLevel === "basic" ? { category: "basic" } : undefined,
        subscriptionLevel === "premium" ? { category: { in: ["basic", "premium"] } } : undefined,
      ].filter(Boolean) as Prisma.PostWhereInput[], 
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
    },
  });
}


export async function fetchPostsById(id: string) {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}


export async function fetchProfile(username: string) {
  noStore();

  try {
    const data = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        saved: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw new Error("Profile not found");
    }

    // Validar o campo verifiedProfile
    const verifiedProfile =
      data.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED";

    // Retornar os dados com o campo validado
    return {
      ...data,
      verifiedProfile,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch profile");
  }
}



export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch saved posts");
  }
}

export async function fetchUserPurchases(userId: string) {
  // Simular dados de compras
  return [
    { id: "1", productName: "Curso Avançado", date: "2024-10-10", amount: 199.99 },
    { id: "2", productName: "E-book de Fotografia", date: "2024-08-15", amount: 49.99 },
  ];
}

export async function fetchUserSubscriptions(userId: string) {
  // Simular dados de assinaturas
  return [
    { id: "1", planName: "Premium", isActive: true, expiryDate: "2024-12-31" },
    { id: "2", planName: "Basic", isActive: false, expiryDate: "2024-06-30" },
  ];
}

export async function fetchPostsByCategory(category: string, limit: number) {
  return await prisma.post.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function fetchPostsByUserId(userId: string) {
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      comments: { include: { user: true } },
      likes: { include: { user: true } },
      savedBy: true,
      user: true,
    },
  });

  return posts;
}

type Story = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
};

export async function fetchStoriesByUserId(userId: string, limit: number) {
  return prisma.story.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      videoUrl: true,
      thumbnailUrl: true,
    },
  });
}


export async function fetchUserSocials(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { socials: true },
    });

    if (user && typeof user.socials === "string") {
      return JSON.parse(user.socials) as {
        indecent?: string;
        whatsapp?: string;
        instagram?: string;
        tiktok?: string;
        facebook?: string;
        pinterest?: string;
        twitter?: string;
        youtube?: string;
        onlyfans?: string;
        privacy?: string;
      };
    }

    // Retorna um objeto vazio caso não haja redes sociais
    return {};
  } catch (error) {
    console.error("Erro ao buscar redes sociais:", error);
    throw new Error("Falha ao buscar redes sociais do usuário");
  }
}
*/

/*

import { unstable_noStore as noStore } from "next/cache";
import prisma from "./prisma";

export async function fetchPosts() {
  noStore();

  try {
    const data = await prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchPostsById(id: string) {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchProfile(username: string) {
  noStore();

  try {
    const data = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        saved: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
      },
    });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch saved posts");
  }
}

*/