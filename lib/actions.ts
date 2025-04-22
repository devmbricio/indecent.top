"use server";

import prisma from "@/lib/prisma";
import { CreateAdsPost } from "./schemas"; // Certifique-se de importar o CreateAdsPost
import { getUserId } from "@/lib/utils";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BookmarkSchema,
  CreateComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  FollowUser,
  LikeSchema,
  UpdatePost,
  UpdateUser,
} from "./schemas";
import { z } from "zod";



export async function createAdsPost(values: z.infer<typeof CreateAdsPost>) {
  const userId = await getUserId(); // Obtém o ID do usuário autenticado

  const validatedFields = CreateAdsPost.safeParse(values); // Valida os campos com base no esquema
  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Check input fields.",
    };
  }

  const {
    fileUrls,
    caption,
    category,
    nome,
    age,
    peso,
    altura,
    dote,
    valor,
    whatsapp,
    instagram,
    facebook,
    tiktok,
    privacy,
    onlyfans,
  } = validatedFields.data;

  try {
    const adPost = await prisma.post.create({
      data: {
        fileUrls,
        caption,
        category,
        userId,
        nome,
        age,
        peso,
        altura,
        dote,
        valor,
        whatsapp,
        instagram,
        facebook,
        tiktok,
        privacy,
        onlyfans,
        city: values.city || "Unknown", // Adicione city
        country: values.country || "Unknown", // Adicione country
        tags: ["ads", "publicidade", "anúncios"],
      },
    });
    revalidatePath("/painel");
    return { message: "Ad Post criado com sucesso.", errors: null };
  } catch (error) {
    console.error("Erro ao criar Ad Post no banco de dados:", error);
    return { message: "Erro ao criar Ad Post no banco de dados.", errors: null };
  }
}


// actions.ts
export async function createPost(values: z.infer<typeof CreatePost>) {
  const userId = await getUserId();

  const validatedFields = CreatePost.safeParse(values);
  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Check input fields.",
    };
  }

  const { fileUrls, caption, category } = validatedFields.data;

  if (!fileUrls || fileUrls.length === 0) {
    console.error("fileUrls is empty or undefined.");
    return {
      errors: { fileUrls: ["No file URLs provided."] },
      message: "Validation failed. No file URLs provided.",
    };
  }

  try {
    const post = await prisma.post.create({
      data: {
        fileUrls,
        caption,
        category,
        tags: ["conteudo-adulto", 
          "hentai", 
          "amador", 
          "plataforma-de-afiliados",  
          "criadores-de-conteúdo", 
          "live-ao-vivo", "acompanhantes", 
          "OnlyFans brasileiro", 
          "www.onlyfans.com",   
          "onlyfans",   
          "www.privacy.com",  
          "privacy",  
          "xvideos", 
          "www.xvideos.com", 
          "socaseiras", 
          "www.socadseiras.com.br",  
          "lésbica",
          "milf",
          "cosplay",
          "femdom",
          "dominição",
          "inversão-de-papéis",
          "lcasal bi",
          "lésbica",
          "sexo",
          "putaria",
          "swing",
          "intimidades-caseiras",
          "troca de casais"], // Adicione tags ao post
        user: {
          connect: { id: userId },
        },
      },
    });
    revalidatePath("/painel");
    return { message: "Post criado com sucesso.", errors: null };
  } catch (error) {
    console.error("Database error while creating post:", error);
    return { message: "Erro ao criar post no banco de dados.", errors: null };
  }
}



export async function deletePost(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeletePost.parse({
    id: formData.get("id"),
  });

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
    revalidatePath("/painel");
    return { message: "Deleted Post." };
  } catch (error) {
    return { message: "Database Error: Faile to Delete Post." };
  }
}

export async function likePost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = LikeSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Like Post.",
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/painel");
      return { message: "Unliked Post." };
    } catch (error) {
      return { message: "Database Error: Failed to Unlike Post." };
    }
  }

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/painel");
    return { message: "Liked Post." };
  } catch (error) {
    return { message: "Database Error: Failed to Like Post." };
  }
}

export async function bookmarkPost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = BookmarkSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Bookmark Post.",
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  const bookmark = await prisma.savedPost.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (bookmark) {
    try {
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/painel");
      return { message: "Unbookmarked Post." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unbookmark Post.",
      };
    }
  }

  try {
    await prisma.savedPost.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/painel");
    return { message: "Bookmarked Post." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Bookmark Post.",
    };
  }
}

export async function createComment(values: z.infer<typeof CreateComment>) {
  const userId = await getUserId();

  const validatedFields = CreateComment.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Comment",
    };
  }
  const { postId, body } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    throw new Error("Post not found");
  }
  try {
    await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
      },
    });
    revalidatePath("/painel");
    return { message: "Created Comment." };
  } catch (error) {
    return { message: "Database Error: Failed to Create Comment." };
  }
}

export async function deleteComment(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeleteComment.parse({ id: formData.get("id") });
  const comment = await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!comment) {
    throw new Error("Comment not found");
  }

  try {
    await prisma.comment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/painel");
    return { message: "Deleted Comment." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Comment." };
  }
}

export async function updatePost(values: z.infer<typeof UpdatePost>) {
  const userId = await getUserId();
  const validatedFields = UpdatePost.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post",
    };
  }

  const { id, fileUrls, caption } = validatedFields.data;
  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        fileUrls,
        caption,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Post." };
  }
  revalidatePath("/painel");
  redirect("/painel");
}

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();
  const validatedFields = UpdateUser.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Profile.",
    };
  }
  const { bio, gender, image, name, username, website } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        image,
        bio,
        gender,
        website,
      },
    });
    revalidatePath("/painel");
    return { message: "Updated Profile" };
  } catch (error) {
    return { message: "Database Error: Failed to Update Profile." };
  }
}

export async function followUser(formData: FormData) {
  const userId = await getUserId();

  const { id } = FollowUser.parse({
    id: formData.get("id"),
  });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Usar findFirst em vez de findUnique para chaves compostas
  const follows = await prisma.follows.findFirst({
    where: {
      followerId: userId,
      followingId: id,
    },
  });

  if (follows) {
    try {
      await prisma.follows.deleteMany({
        where: {
          followerId: userId,
          followingId: id,
        },
      });
      revalidatePath("/painel");
      return { message: "Unfollowed User." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unfollow User.",
      };
    }
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
    revalidatePath("/painel");
    return { message: "Followed User." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Follow User.",
    };
  }
}


/*
"use server";

import prisma from "@/lib/prisma";

import { getUserId } from "@/lib/utils";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BookmarkSchema,
  CreateComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  FollowUser,
  LikeSchema,
  UpdatePost,
  UpdateUser,
} from "./schemas";
import { z } from "zod";

// actions.ts
export async function createPost(values: z.infer<typeof CreatePost>) {
  const userId = await getUserId();

  const validatedFields = CreatePost.safeParse(values);
  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Check input fields.",
    };
  }

  const { fileUrls, caption, category } = validatedFields.data;

  if (!fileUrls || fileUrls.length === 0) {
    console.error("fileUrls is empty or undefined.");
    return {
      errors: { fileUrls: ["No file URLs provided."] },
      message: "Validation failed. No file URLs provided.",
    };
  }

  try {
    const post = await prisma.post.create({
      data: {
        fileUrls,
        caption,
        category,
        tags: ["conteudo-adulto", 
          "hentai", 
          "amador", 
          "plataforma-de-afiliados",  
          "criadores-de-conteúdo", 
          "live-ao-vivo", "acompanhantes", 
          "OnlyFans brasileiro", 
          "www.onlyfans.com",   
          "onlyfans",   
          "www.privacy.com",  
          "privacy",  
          "xvideos", 
          "www.xvideos.com", 
          "socaseiras", 
          "www.socadseiras.com.br",  
          "lésbica",
          "milf",
          "cosplay",
          "femdom",
          "dominição",
          "inversão-de-papéis",
          "lcasal bi",
          "lésbica",
          "sexo",
          "putaria",
          "swing",
          "intimidades-caseiras",
          "troca de casais"], // Adicione tags ao post
        user: {
          connect: { id: userId },
        },
      },
    });
    revalidatePath("/painel");
    return { message: "Post criado com sucesso.", errors: null };
  } catch (error) {
    console.error("Database error while creating post:", error);
    return { message: "Erro ao criar post no banco de dados.", errors: null };
  }
}



export async function deletePost(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeletePost.parse({
    id: formData.get("id"),
  });

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
    revalidatePath("/painel");
    return { message: "Deleted Post." };
  } catch (error) {
    return { message: "Database Error: Faile to Delete Post." };
  }
}

export async function likePost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = LikeSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Like Post.",
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/painel");
      return { message: "Unliked Post." };
    } catch (error) {
      return { message: "Database Error: Failed to Unlike Post." };
    }
  }

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/painel");
    return { message: "Liked Post." };
  } catch (error) {
    return { message: "Database Error: Failed to Like Post." };
  }
}

export async function bookmarkPost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = BookmarkSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Bookmark Post.",
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  const bookmark = await prisma.savedPost.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (bookmark) {
    try {
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/painel");
      return { message: "Unbookmarked Post." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unbookmark Post.",
      };
    }
  }

  try {
    await prisma.savedPost.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/painel");
    return { message: "Bookmarked Post." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Bookmark Post.",
    };
  }
}

export async function createComment(values: z.infer<typeof CreateComment>) {
  const userId = await getUserId();

  const validatedFields = CreateComment.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Comment",
    };
  }
  const { postId, body } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    throw new Error("Post not found");
  }
  try {
    await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
      },
    });
    revalidatePath("/painel");
    return { message: "Created Comment." };
  } catch (error) {
    return { message: "Database Error: Failed to Create Comment." };
  }
}

export async function deleteComment(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeleteComment.parse({ id: formData.get("id") });
  const comment = await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!comment) {
    throw new Error("Comment not found");
  }

  try {
    await prisma.comment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/painel");
    return { message: "Deleted Comment." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Comment." };
  }
}

export async function updatePost(values: z.infer<typeof UpdatePost>) {
  const userId = await getUserId();
  const validatedFields = UpdatePost.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post",
    };
  }

  const { id, fileUrls, caption } = validatedFields.data;
  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        fileUrls,
        caption,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Post." };
  }
  revalidatePath("/painel");
  redirect("/painel");
}

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();
  const validatedFields = UpdateUser.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Profile.",
    };
  }
  const { bio, gender, image, name, username, website } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        image,
        bio,
        gender,
        website,
      },
    });
    revalidatePath("/painel");
    return { message: "Updated Profile" };
  } catch (error) {
    return { message: "Database Error: Failed to Update Profile." };
  }
}

export async function followUser(formData: FormData) {
  const userId = await getUserId();

  const { id } = FollowUser.parse({
    id: formData.get("id"),
  });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Usar findFirst em vez de findUnique para chaves compostas
  const follows = await prisma.follows.findFirst({
    where: {
      followerId: userId,
      followingId: id,
    },
  });

  if (follows) {
    try {
      await prisma.follows.deleteMany({
        where: {
          followerId: userId,
          followingId: id,
        },
      });
      revalidatePath("/painel");
      return { message: "Unfollowed User." };
    } catch (error) {
      return {
        message: "Database Error: Failed to Unfollow User.",
      };
    }
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
    revalidatePath("/painel");
    return { message: "Followed User." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Follow User.",
    };
  }
}
*/