import { NextApiRequest } from 'next';
import { User } from "@prisma/client";
import type { Icon } from "lucide-react";
import { Icons } from "@/components/shared/icons";
import { MetaMaskInpageProvider } from "@metamask/providers";
import videojs from "video.js";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    IVSBroadcastClient: any;
    streamKey: string;
    playbackUrl: string;
  }
}

declare module "node-fetch" {
  import { RequestInit, Response } from "node-fetch";
  export default function fetch(url: string, init?: RequestInit): Promise<Response>;
}


declare module "agora-access-token" {
  export function RtcTokenBuilder(
    appID: string,
    appCertificate: string,
    channelName: string,
    uid: string | number,
    role: number,
    expireTimestamp: number
  ): string;
}

declare module "canvas-confetti" {
  const confetti: any;
  export default confetti;
}


declare module "amazon-ivs-rtc" {
  export function createStage(params: {
    token: string;
    role: "host" | "audience";
    videoElement: HTMLVideoElement;
  }): Promise<{
    start: () => void;
    stop: () => void;
  }>;
}


declare module "video.js" {
  interface VideoJsPlayer {
    // Métodos específicos do Amazon IVS
    getIVSPlayer: () => IVSPlayer;
    getIVSEvents: () => IVSEvents;
    enableIVSQualityPlugin?: () => void; // Marcado como opcional
  }
}

// Tipos para o Amazon IVS Player
interface IVSPlayer {
  addEventListener: (eventType: string, callback: (event: any) => void) => void;
  removeEventListener: (eventType: string, callback: (event: any) => void) => void;
}

interface IVSEvents {
  PlayerEventType: {
    ERROR: string;
    PLAYBACK_STATE_CHANGED: string;
  };
}


export interface Window {
  ethereum: any
  IVSBroadcastClient: any;
  streamKey: string;
  playbackUrl: string;
}

// Interface para API Requests com autenticação
export interface AuthenticatedNextApiRequest extends NextApiRequest {
  userId?: string;
  subscriptionLevel: "free" | "basic" | "premium"; // Adicionar subscriptionLevel
  stripeSubscriptionId: string | null;
  affiliateRole: "AFFILIATE" | "USER";
  influencerRole: "INFLUENCER" | "USER";
  job: string; // Ou o tipo que você usa para 'job', como enum JobRole
  interests: string,
  referredBy?: string | null;
  referralId?: string | null;// Adicionado o campo referralId
  referredById?: string | null; // Adicionado o campo referredById como opcional
}

// Sessão de usuário estendida com tipagem adicional
export type Session = {
  userId: UserId;
  id: string;
  _id: string;
  username: string | null;
  name: string | null;
  email: string;
  password: string;
  avatar?: string | null;
  verifiedProfile:  "VERIFIED" | "NOTVERIFIED";
  affiliateRole: "AFFILIATE" | "USER";
  influencerRole: "INFLUENCER" | "USER";
  posts:  string;
  reels:  string;
  interests: string,
  socialInteractions: string;
  referredBy?: string | null;
  referralId?: string | null;// Adicionado o campo referralId
  referredById?: string | null; // Adicionado o campo referredById como opcional
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
  stripeCustomerId: string | null; // Permitir null
  isActive: boolean;
  isSubscribed: boolean; // Ajuste para boolean
  UserSubscriptionPlan: string;
  subscriptionLevel: "free" | "basic" | "premium"; // Adicione subscriptionLevel aqui
  verificationPurchased: boolean;
  userLanguage: string;
  userStatus: string;
  getCurrentUser: string;
  job: JobRole; // Tipo do cargo ou papel (enum JobRole)
};

// Configurações de navegação
export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

// Configurações de site e dashboard
export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

// Tipagem para planos de assinatura e suas propriedades relacionadas ao Stripe
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  influencer: string[];
  influencers: string[];
  affiliates: string[];
  images: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year";
    isCanceled?: boolean;
    isActive?: boolean;
  };

// Listagem de informações do usuário com ícones
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string | null; // Ajuste aqui para aceitar uma string ou null
  description: string;
  list: InfoList[];
};

// Planos de websites e integrações com Stripe para compras
export type WebsitesPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  images: string[];
  prices: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
  };
  stripeIds: {
    monthly?: string | null;
    yearly?: string | null;
    oneTime?: string | null;
  };
};

export type UserWebsitesPlan = WebsitesPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// Planos e benefícios de estratégia digital e plano de vendas
export type DigitalStrategyPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserDigitalStrategyPlan = DigitalStrategyPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// Planos de vendas e vendas avulsas
export type MinutsSales = {
  title: string;
  description: string;
  images: string[];
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
    oneTime?: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
    oneTime?: string | null;
  };
};

export type UserMinutsSales = MinutsSales &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
    isOneTimePurchase?: boolean;
  };


  // compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};
