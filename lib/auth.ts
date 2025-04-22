import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // 🔹 Agora usando bcryptjs
import { getSubscriptionLevel } from "@/utils/getSubscriptionLevel";
import { v4 as uuid } from "uuid";

// Enums para os papéis dos usuários
export enum AffiliateRole {
  AFFILIATE = "AFFILIATE",
  USER = "USER",
}

export enum InfluencerRole {
  USER = "USER",
  INFLUENCER = "INFLUENCER",
}

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    // 🔹 Google Authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    // 🔹 Login com Email/Senha
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        // Buscar usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

          // 🔹 Garantir que password nunca seja null
        const userPassword = user.password || "";

        // 🔹 Verificar senha usando bcryptjs
        const isValidPassword = bcrypt.compareSync(credentials.password, userPassword);
        if (!isValidPassword) {
          throw new Error("Senha incorreta.");
        }
    
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/painel",
    error: "/Custom404",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log("SignIn callback triggered:", { user, account });

        if (account?.provider === "google") {
          let dbUser = await prisma.user.findUnique({ where: { email: user.email! } });

          if (!dbUser) {
            const username = user.name
              ? user.name.toLowerCase().replace(/\s+/g, "_")
              : `user_${Math.floor(Math.random() * 10000)}`;

            console.log("Creating new user via Google Login");

            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "Usuário",
                username,
                password: uuid(), // Senha fake para evitar login via credenciais
                referralId: uuid(),
                affiliate: AffiliateRole.USER,
                influencer: InfluencerRole.USER,
                interests: { create: [] },
              },
            });
          }

          return true;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async session({ token, session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "" },
      });

      if (dbUser) {
        const subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);

        session.user = {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username || null,
          stripeCustomerId: dbUser.stripeCustomerId || null,
          stripeSubscriptionId: dbUser.stripeSubscriptionId || null,
          subscriptionLevel,
          affiliateRole: dbUser.affiliate || AffiliateRole.USER,
          influencerRole: dbUser.influencer || InfluencerRole.USER,
          isAdmin: dbUser.isAdmin || false,
          isSubscribed: Boolean(dbUser.stripeSubscriptionId),
          image: dbUser.image || null,
          referralId: dbUser.referralId ?? "missing-referral",
          job: dbUser.job || "USER",
        };
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.stripeCustomerId = dbUser.stripeCustomerId || null;
          token.isAdmin = dbUser.isAdmin || false;
          token.isSubscribed = Boolean(dbUser.stripeSubscriptionId);
          token.stripeSubscriptionId = dbUser.stripeSubscriptionId || null;
          token.subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);
          token.affiliateRole = dbUser.affiliate || AffiliateRole.USER;
          token.influencerRole = dbUser.influencer || InfluencerRole.USER;
          token.referralId = dbUser.referralId ?? "missing-referral";
          token.job = dbUser.job || "USER";
        }
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith("/painel")) {
        return `${baseUrl}${url}`;
      }
      return "/painel";
    },
  },
};

export default NextAuth(authOptions);




/* funcional antes do login email e senha
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSubscriptionLevel } from "@/utils/getSubscriptionLevel";
import { v4 as uuid } from "uuid"; // Biblioteca para gerar UUIDs

// Enum para AffiliateRole
export enum AffiliateRole {
  AFFILIATE = "AFFILIATE",
  USER = "USER",
}

export enum InfluencerRole {
  USER = "USER",
  INFLUENCER = "INFLUENCER",
}

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/painel",
    error: "/Custom404",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log("SignIn callback triggered:", { user, account });

        // Captura o `referralId` do cookie ou da URL
        const referralId =
          account?.id_token &&
          decodeURIComponent(
            account.id_token.split(";").find((cookie) => cookie.includes("referralId="))?.split("=")[1] || ""
          );

        if (referralId && typeof referralId !== "string") {
          throw new Error(`Invalid referralId type: ${typeof referralId}`);
        }

        // Busca o usuário correspondente ao `referralId`
        const referrerUser = referralId
          ? await prisma.user.findUnique({
              where: { referralId },
            })
          : null;

        const referredById = referrerUser?.id || null;

        // Verifica se o usuário já existe no banco
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!dbUser) {
          const username = user.name
            ? user.name.toLowerCase().replace(/\s+/g, "_")
            : `user_${Math.floor(Math.random() * 10000)}`;

          console.log("Creating new user with referral ID:", referredById);

          // Cria um novo usuário no banco
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "Usuário",
              username,
              stripeSubscriptionId: null,
              affiliate: AffiliateRole.USER,
              influencer: InfluencerRole.USER,
              password: uuid(), // Placeholder para usuários OAuth
              referralId: uuid(),
              referredById, // Define o ID do referenciador, se disponível
            },
          });
        } else if (!dbUser.referredById && referredById) {
          // Atualiza o campo `referredById` caso ainda não tenha sido definido
          console.log("Updating referredById for existing user:", referredById);
          await prisma.user.update({
            where: { email: user.email! },
            data: { referredById },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async session({ token, session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "" },
      });

      if (dbUser) {
        const subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);

        session.user = {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username || null,
          stripeCustomerId: dbUser.stripeCustomerId || null,
          stripeSubscriptionId: dbUser.stripeSubscriptionId || null,
          subscriptionLevel,
          affiliateRole: dbUser.affiliate || AffiliateRole.USER,
          influencerRole: dbUser.influencer || InfluencerRole.USER,
          isAdmin: dbUser.isAdmin || false,
          isSubscribed: Boolean(dbUser.stripeSubscriptionId),
          image: dbUser.image || null,
          referralId: dbUser.referralId ?? "missing-referral",
          job: dbUser.job || "USER",
        };
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.stripeCustomerId = dbUser.stripeCustomerId || null;
          token.isAdmin = dbUser.isAdmin || false;
          token.isSubscribed = Boolean(dbUser.stripeSubscriptionId);
          token.stripeSubscriptionId = dbUser.stripeSubscriptionId || null;
          token.subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);
          token.affiliateRole = dbUser.affiliate || AffiliateRole.USER;
          token.influencerRole = dbUser.influencer || InfluencerRole.USER;
          token.referralId = dbUser.referralId ?? "missing-referral";
          token.job = dbUser.job || "USER";
        }
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith("/painel")) {
        return `${baseUrl}${url}`;
      }
      return "/painel";
    },
  },
};
*/





/* funcional mas nao carrega referredById
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSubscriptionLevel } from "@/utils/getSubscriptionLevel";
import { v4 as uuid } from "uuid"; // Biblioteca para gerar UUIDs

// Enum para AffiliateRole
export enum AffiliateRole {
  AFFILIATE = "AFFILIATE",
  USER = "USER",
}

export enum InfluencerRole {
  USER = "USER",
  INFLUENCER = "INFLUENCER"
}

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/painel",
    error: "/Custom404",
  },
  callbacks: {
    async signIn({ user }) {
      // Tenta encontrar o usuário no banco
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!dbUser) {
        // Gera um username padrão para novos usuários
        const username = user.name
          ? user.name.toLowerCase().replace(/\s+/g, "_")
          : `user_${Math.floor(Math.random() * 10000)}`;

        // Cria o usuário no banco de dados
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name || "Usuário",
            username,
            stripeSubscriptionId: null,
            affiliate: AffiliateRole.USER, // Define como padrão
            influencer: InfluencerRole.USER, // Define como padrão
            password: "sua senha", // Placeholder para usuários OAuth
            referralId: uuid(), // Gera um ID exclusivo para referrals
          },
        });
      }
      console.log(uuid());
      return true;
    },
    

    async session({ token, session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "" },
      });

      if (dbUser) {
        const subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);

        session.user = {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username || null,
          stripeCustomerId: dbUser.stripeCustomerId || null,
          stripeSubscriptionId: dbUser.stripeSubscriptionId || null,
          subscriptionLevel,
          affiliateRole: dbUser.affiliate || AffiliateRole.USER, // Adicionando affiliateRole
          influencerRole: dbUser.influencer || InfluencerRole.USER, // Adicionando affiliateRole
          isAdmin: dbUser.isAdmin || false,
          isSubscribed: Boolean(dbUser.stripeSubscriptionId),
          image: dbUser.image || null,
          referralId: dbUser.referralId ?? "missing-referral",
          job: dbUser.job || "USER", // Adicionando o campo job aqui também
        };
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.stripeCustomerId = dbUser.stripeCustomerId || null;
          token.isAdmin = dbUser.isAdmin || false;
          token.isSubscribed = Boolean(dbUser.stripeSubscriptionId);
          token.stripeSubscriptionId = dbUser.stripeSubscriptionId || null;
          token.subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);
          token.affiliateRole = dbUser.affiliate || AffiliateRole.USER; // Adicionando affiliateRole
          token.influencerRole = dbUser.influencer || InfluencerRole.USER; // Adicionando affiliateRole
          token.referralId = dbUser.referralId ?? "missing-referral"; // Garante string mesmo que null
          token.job = dbUser.job || "USER"; // Garantindo que `job` vem do banco de dados
        }
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith("/painel")) {
        return `${baseUrl}${url}`;
      }
      return "/painel";
    },
  },
};


/* funcional mas perdeu o codigo de referral
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSubscriptionLevel } from "@/utils/getSubscriptionLevel";

// Enum para AffiliateRole
export enum AffiliateRole {
  AFFILIATE = "AFFILIATE",
  USER = "USER",
}

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/painel",
    error: "/Custom404",
  },
  callbacks: {
    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!dbUser) {
        const username = user.name
          ? user.name.toLowerCase().replace(/\s+/g, "_")
          : `user_${Math.floor(Math.random() * 10000)}`;

        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name || "Usuário",
            username,
            stripeSubscriptionId: null,
            affiliate: AffiliateRole.USER, // Valor padrão
            password: "sua senha", // Placeholder para usuários OAuth
          },
        });
      }

      return true;
    },

    async session({ token, session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "" },
      });

      if (dbUser) {
        const subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);

        session.user = {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username || null,
          stripeCustomerId: dbUser.stripeCustomerId || null,
          stripeSubscriptionId: dbUser.stripeSubscriptionId || null,
          subscriptionLevel,
          affiliateRole: dbUser.affiliate || AffiliateRole.USER, // Adicionando affiliateRole
          isAdmin: dbUser.isAdmin || false,
          isSubscribed: Boolean(dbUser.stripeSubscriptionId),
          image: dbUser.image || null,
        };
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.stripeCustomerId = dbUser.stripeCustomerId || null;
          token.isAdmin = dbUser.isAdmin || false;
          token.isSubscribed = Boolean(dbUser.stripeSubscriptionId);
          token.stripeSubscriptionId = dbUser.stripeSubscriptionId || null;
          token.subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);
          token.affiliateRole = dbUser.affiliate || AffiliateRole.USER; // Adicionando affiliateRole
        }
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith("/painel")) {
        return `${baseUrl}${url}`;
      }
      return "/painel";
    },
  },
};
*/



/*


import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getSubscriptionLevel } from "@/utils/getSubscriptionLevel";

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/painel",
    error: "/Custom404",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      if (!dbUser) {
        const username = user.name
          ? user.name.toLowerCase().replace(/\s+/g, "_")
          : `user_${Math.floor(Math.random() * 10000)}`;

        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name || "Usuário",
            username,
            stripeSubscriptionId: null,
            password: "sua senha", // Placeholder para usuários OAuth
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "" },
      });

      if (dbUser) {
        const subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);

        session.user = {
          ...session.user,
          id: dbUser.id,
          username: dbUser.username || null,
          stripeCustomerId: dbUser.stripeCustomerId || null,
          stripeSubscriptionId: dbUser.stripeSubscriptionId || null,
          subscriptionLevel,
          isAdmin: dbUser.isAdmin || false,
          isSubscribed: Boolean(dbUser.stripeSubscriptionId),
          image: dbUser.image || null,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.stripeCustomerId = dbUser.stripeCustomerId || null;
          token.isAdmin = dbUser.isAdmin || false;
          token.isSubscribed = Boolean(dbUser.stripeSubscriptionId);
          token.stripeSubscriptionId = dbUser.stripeSubscriptionId || null;
          token.subscriptionLevel = getSubscriptionLevel(dbUser.stripeSubscriptionId);
        }
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith("/painel")) {
        return `${baseUrl}${url}`;
      }
      return "/painel";
    },
  },
};
*/


