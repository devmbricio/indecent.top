import type {
  Comment,
  Follows,
  Like,
  Post,
  SavedPost,
  User,
} from "@prisma/client";

// Define os tipos para os comentários com dados adicionais do usuário
export type CommentWithExtras = Comment & {
  user: {
    id: string;
    name: string | null;
    username: string | null;
  };
};

// Define os tipos para os likes com informações adicionais do usuário
export type LikeWithExtras = Like & {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
};

// Define o tipo para os posts com dados adicionais
export type PostWithExtras = Post & {
  nome?: string | null;
  age?: string | null;
  peso?: string | null;
  altura?: string | null;
  dote?: string | null;
  valor?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  privacy?: string | null;
  onlyfans?: string | null;
  isBlurred?: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  caption: string | null; // Permitir valores nulos
  tags: string[];
  fileUrls: string[]; // Array de URLs de arquivos associados ao post
  category: string;
  userId: string;
  user: {
    id: string;
    name: string | null; // Permitir valores nulos
    username: string | null; // Permitir valores nulos
  };
  comments: CommentWithExtras[]; // Comentários associados ao post
  likes: {
    id: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null; // Permitir valores nulos
      username: string | null;
      image: string | null;
    };
  }[];
  savedBy: {
    id: string;
    createdAt: Date;
    userId: string;
    postId: string;
  }[];
};

// Define o tipo para usuários com dados sobre seus seguidores e seguidos
export type UserWithFollows = User & {
  following: Follows[]; // Lista de usuários seguidos
  followedBy: Follows[]; // Lista de seguidores
};

// Define o tipo para seguidores com informações adicionais
export type FollowerWithExtras = Follows & {
  follower: UserWithFollows; // Dados completos sobre o seguidor
};

// Define o tipo para seguidos com informações adicionais
export type FollowingWithExtras = Follows & {
  following: UserWithFollows; // Dados completos sobre o seguido
};

// Define o tipo completo para um usuário com dados adicionais
export type UserWithExtras = User & {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  bio: string | null;
  website: string | null;
  gender: string | null;
  image: string | null;
  privacy?: string | null; // Tornar opcional
  verifiedProfile: "VERIFIED" | "NOTVERIFIED";
  posts: PostWithExtras[];
  saved: SavedPost[];
  followedBy: FollowerWithExtras[];
  following: FollowingWithExtras[];
  subscriptionLevel: "free" | "basic" | "premium";
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;
  credits: number;
  role: string; // Tipo ajustado para refletir o Prisma (UserRole)
  verificationPurchased: boolean;
  postsThisMonth: number;
  reels:  string;
  socialInteractions: string | null;
  referralId: string;
  socials: {
    indecent?: string | null;
    whatsapp?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    facebook?: string | null;
    pinterest?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    onlyfans?: string | null;
    privacySocial?: string | null;
  };
  isAdmin: boolean;
};








/*
import type {
  Comment,
  Follows,
  Like,
  Post,
  SavedPost,
  User,
} from "@prisma/client";

export type CommentWithExtras = Comment & { user: User };
export type LikeWithExtras = Like & { user: User };

export type PostWithExtras = Post & {
  comments: CommentWithExtras[];
  likes: LikeWithExtras[];
  savedBy: SavedPost[];
  user: User;
};

export type UserWithFollows = User & {
  following: Follows[];
  followedBy: Follows[];
};
export type FollowerWithExtras = Follows & { follower: UserWithFollows };
export type FollowingWithExtras = Follows & { following: UserWithFollows };

export type UserWithExtras = User & {
  posts: Post[];
  saved: SavedPost[];
  followedBy: FollowerWithExtras[];
  following: FollowingWithExtras[];
};
*/

/*
import type {
  Comment,
  Follows,
  Like,
  Post,
  SavedPost,
  User,
} from "@prisma/client";

export type CommentWithExtras = Comment & {
  user: {
    id: string;
    name: string | null;
    username: string | null;
  };
};

export type LikeWithExtras = Like & { user: User };

export type PostWithExtras = Post & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  caption: string | null; // Permitir `null` aqui
  fileUrls: string[]; // Alterado para um array de strings
  category: string;
  userId: string;
  user: {
    id: string;
    name: string | null; // Permitir `null` aqui
    username: string | null; // Permitir `null` aqui
  };
  comments: CommentWithExtras[]; // Certifique-se de usar o tipo correto
  likes: {
    id: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null; // Permitir `null` aqui
    };
  }[];
  savedBy: {
    id: string;
    createdAt: Date;
    userId: string;
    postId: string;
  }[];
};

export type UserWithFollows = User & {
  following: Follows[];
  followedBy: Follows[];
};

export type FollowerWithExtras = Follows & { follower: UserWithFollows };
export type FollowingWithExtras = Follows & { following: UserWithFollows };

export type UserWithExtras = User & {
  posts: Post[];
  saved: SavedPost[];
  followedBy: FollowerWithExtras[];  // Tipagem correta
  following: FollowingWithExtras[];   // Tipagem correta
};

*/