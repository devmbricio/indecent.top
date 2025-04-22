import { authOptions } from "./auth";
import { getServerSession } from "next-auth";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";
import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const getUserId = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("You must be signed in to use this feature");
  }
  return userId;
};

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

//
export function generateRandomPassword() {
  const length = 10;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-={}[];',./<>?~`|:\"\\";

  let password = "";

  // Add one uppercase letter
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );

  // Add one numeric digit
  password += numericChars.charAt(
    Math.floor(Math.random() * numericChars.length)
  );

  // Add at least one special character
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Add remaining characters randomly
  const remainingChars =
    uppercaseChars + uppercaseChars.toLowerCase() + numericChars + specialChars;
  for (let i = 3; i < length; i++) {
    password += remainingChars.charAt(
      Math.floor(Math.random() * remainingChars.length)
    );
  }

  // Shuffle the password to make it more random
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return password;
}
  //


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

// Utils from precedent.dev
export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/indecent-top-logo.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    keywords: [
"Vídeo chamadas",
"Sexy cam",
"Rede social para adulto",
"Câmeras ao vivo",
"Live adulto",
"Chat privado adulto",
"Fotos sensuais",
"Vídeos exclusivos",
"Conteúdo adulto ao vivo",
"Plataforma de entretenimento adulto",
"Criadores de conteúdo adulto",
"Venda de conteúdo privado",
"Assinatura de lives sensuais",
"Plataforma para modelos",
"Ganhe com conteúdo adulto",
"Streaming adulto",
"Conexão com fãs adultos",
"Interação ao vivo",
"Lives VIP",
"Chat ao vivo adulto",
"Conteúdo exclusivo para assinantes",
"Entretenimento adulto online",
"Conteúdo sensual",
"Modelos ao vivo",
"Acesso exclusivo",
"Conteúdo adulto brasileiro",
"Lives interativas",
"Rede social discreta",
"Vídeos sensuais",
"Plataforma adulta segura",
"Assinaturas privadas",
"Chat sensual ao vivo",
"Lives de alta qualidade",
"Câmeras sensuais ao vivo",


  
    ],
    authors: [
      {
        name: "indecent.top",
      },
    ],
    creator: "indecent.top",
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: siteConfig.url,
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@indecent.top",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}