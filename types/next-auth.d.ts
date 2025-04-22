/* eslint-disable no-unused-vars */
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { Language, UserRole,  } from "@prisma/client"; 

type UserId = string;

export type ExtendedUser = User & {
  role: UserRole;

  subscriptionLevel: "free" | "basic" | "premium"; // Adicionar subscriptionLevel
  stripeSubscriptionId: string | null;
  posts:  string;
  reels:  string;
  socialInteractions: string;
  referredBy?: string | null;
  referralId: string | null;// Adicionado o campo referralId
  referredById?: string | null; // Adicionado o campo referredById como opcional
  job: JobRole; // Tipo do cargo ou papel (enum JobRole)
  credits: true, // Inclua os créditos aqui
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
    job: JobRole; // Adicionado JobRole
    affiliateRole: "AFFILIATE" | "USER";
    influencerRole: "INFLUENCER" | "USER";
    stripeSubscriptionId: string | null; // Adicione stripeSubscriptionId aqui
    subscriptionLevel: "free" | "basic" | "premium"; // Adicionar subscriptionLevel
    job: JobRole; // Tipo JobRole para o campo job
    posts:  string;
    reels:  string;
    socialInteractions: string;
    credits: true, // Inclua os créditos aqui
    interests: string,
    referredBy?: string | null;
    referralId?: string | null;// Adicionado o campo referralId
    referredById?: string | null; // Adicionado o campo referredById como opcional
  }
}

export type ExperienceType = {
  role: string;

  company: string;
  companyUrl: string;
  started: Date | string;
  upto: Date | "present" | string;
  tasks: string[];
};

declare module "next-auth" {
  interface Session {
    user: User & {
      userId: UserId;
      id: string;
      _id: string;
      image: string | null;
      isAdmin: boolean;
      name: string;
      username: string | null; // Adicionando `username` como opcional
      email: string;
      password: string;
      stripeCustomerId: string | null;
      isActive: boolean;
      isSubscribed: boolean;
      UserSubscriptionPlan: string;
      lastLoginAt: Date;
      verifiedProfile: "VERIFIED" | "NOTVERIFIED"; 
      posts:  string;
      reels:  string;
      interests: string,
      socialInteractions: string;
      referredBy?: string | null;
      referralId: string | null;// Adicionado o campo referralId
      referredById?: string | null; // Adicionado o campo referredById como opcional
      credits: true, // Inclua os créditos aqui
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
      getCurrentUser: string;
      role: UserRole;
      affiliateRole: "AFFILIATE" | "USER";
      influencerRole: "INFLUENCER" | "USER";
      subscriptionLevel: "free" | "basic" | "premium"; // Adicione subscriptionLevel aqui
      stripeSubscriptionId: string | null; // Adicione stripeSubscriptionId aqui
      verificationPurchased: boolean;
      job: JobRole; // Tipo JobRole para o campo job

    };
  }
}


/*
  
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { Language } from "@prisma/client";

type UserId = string;

export type ExtendedUser = User & {
  role: UserRole;
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
  }
}

export type ExperienceType = {
  role: string;
  company: string;
  companyUrl: string;
  started: Date | string;
  upto: Date | 'present' | string;
  tasks: string[];
};

declare module "next-auth" {
  interface Session {
    user: User & { 
      userId: UserId;
      id: string; 
      _id: string;
      image: string | null; // Ajuste aqui para aceitar uma string ou null
      isAdmin: boolean;
      name: string;
      username?: string;
      email: string;
      stripeCustomerId: string | null; // Permitir null
      isActive: boolean; 
      isAdmin: boolean; 
      avatar?: string | null | undefined;
      userLanguage: string; 
      userStatus: string;
      isSubscribed: boolean,
      UserSubscriptionPlan: string;
      lastLoginAt: Date;
      getCurrentUser: string;
    };
  }
}
*/