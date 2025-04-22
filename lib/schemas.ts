import { z } from "zod";

// Define a estrutura do esquema de postagem, incluindo categoria com valores restritos
export const PostSchema = z.object({
  id: z.string(),
  fileUrls: z.array(z.string()).default([]), // Define como um array de strings
  caption: z.string().optional(),
  category: z.enum(["free", "basic", "premium"]), // Valores restritos para categoria
  userId: z.string(), // Adicionado userId como obrigatório
  tags: z.array(z.string()).optional(), // Novo campo para tags
  city: z.string().optional(),
  country: z.string().optional(),
});

// Esquema para criação de post, omitindo o ID, pois ele será gerado automaticamente
export const CreatePost = PostSchema.omit({ id: true });

// Esquema para criação de AdsPost (post de anúncios)
export const AdsPostSchema = PostSchema.extend({
  /*
  id: z.string(),
  fileUrls: z.array(z.string()).default([]), 
  caption: z.string().optional(),
  category: z.enum(["free", "basic", "premium"]),
  userId: z.string(),
  tags: z.array(z.string()).optional(), // Novo campo para tags
  city: z.string().optional(),
  country: z.string().optional(),
*/
  nome: z.string(),
  age: z.string(),
  peso: z.string(),
  altura: z.string(),
  dote: z.string(),
  valor: z.string(),
  whatsapp: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  tiktok: z.string(),
  privacy: z.string(),
  onlyfans: z.string(),

});

// Esquema para criar AdsPost, omitindo ID
export const CreateAdsPost = AdsPostSchema.omit({ id: true });

// Esquema para atualização de post
export const UpdatePost = PostSchema;

// Esquema para exclusão de post, apenas com o ID
export const DeletePost = PostSchema.pick({ id: true });

// Esquema para curtir um post
export const LikeSchema = z.object({ postId: z.string() });

// Esquema para salvar um post
export const BookmarkSchema = z.object({ postId: z.string() });

// Esquema para comentários, incluindo ID e postId para referência
export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  postId: z.string(),
});

// Esquema para criação de comentário, omitindo o ID
export const CreateComment = CommentSchema.omit({ id: true });

// Esquema para atualização de comentário
export const UpdateComment = CommentSchema;

// Esquema para exclusão de comentário, apenas com o ID
export const DeleteComment = CommentSchema.pick({ id: true });

// Esquema para informações de usuário
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
  bio: z.string().max(150).optional(),
  website: z.string().optional(),
  gender: z.string().optional(),
});

// Esquema para atualização de perfil de usuário
export const UpdateUser = UserSchema;

// Esquema para exclusão de usuário, apenas com o ID
export const DeleteUser = UserSchema.pick({ id: true });

// Esquema para seguir usuário, apenas com o ID
export const FollowUser = UserSchema.pick({ id: true });

/*


import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  fileUrl: z.string().url(),
  caption: z.string().optional(),
});

export const CreatePost = PostSchema.omit({ id: true });
export const UpdatePost = PostSchema;
export const DeletePost = PostSchema.pick({ id: true });
export const LikeSchema = z.object({ postId: z.string() });
export const BookmarkSchema = z.object({ postId: z.string() });
export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  postId: z.string(),
});

export const CreateComment = CommentSchema.omit({ id: true });
export const UpdateComment = CommentSchema;
export const DeleteComment = CommentSchema.pick({ id: true });

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
  bio: z.string().max(150).optional(),
  website: z.string().optional(),
  gender: z.string().optional(),
});

export const UpdateUser = UserSchema;
export const DeleteUser = UserSchema.pick({ id: true });
export const FollowUser = UserSchema.pick({ id: true });
*/