// components/KeywordPage.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import prisma from "@/lib/prisma"; // Importe a instância do Prisma Client diretamente

export default function KeywordPage() {
  const { keyword: routeKeyword } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function checkKeywordAndRedirect() {
      if (routeKeyword) {
        try {
          const foundKeyword = await prisma.keyword.findUnique({
            where: {
              slug: routeKeyword as string, // Use a type assertion para garantir que é string
            },
            include: {
              city: true,
            },
          });

          if (foundKeyword?.city) {
            router.push(`/acompanhantes/${foundKeyword.city.slug}`);
          }
          // Você pode adicionar lógica para redirecionar com base no país também, se necessário
        } catch (error) {
          console.error("Erro ao verificar palavra-chave:", error);
        } finally {
          await prisma.$disconnect();
        }
      }
    }

    checkKeywordAndRedirect();
  }, [routeKeyword, router]);

  return <div>Carregando...</div>; // Ou algum conteúdo genérico para SEO
}

export async function generateStaticParams() {
  try {
    const keywords = await prisma.keyword.findMany({
      select: {
        slug: true,
      },
    });
    return keywords.map((keyword) => ({ keyword: keyword.slug }));
  } catch (error) {
    console.error("Erro ao buscar slugs de palavras-chave:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}


/*
"use client";

import Script from "next/script";
import Header from "@/components/Header";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const topKeywords = [
  "arquitetura tropical",
  "acompanhantes sao paulo", // Exemplo de palavra-chave relacionada a acompanhantes
  // ... seus outros termos
];

const formatKeyword = (keyword: string) => {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
};

export default function KeywordPage() {
  const { keyword: routeKeyword } = useParams();
  const [keyword, setKeyword] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolvedKeyword = (routeKeyword as string)?.replace(/-/g, ' ') || null;
    setKeyword(resolvedKeyword);
  
    if (resolvedKeyword?.includes("acompanhantes sao paulo")) {
      router.push("/acompanhantes/brasil/sao-paulo");
    } else if (resolvedKeyword?.toLowerCase() === "acompanhantes porto alegre") {
      router.push("/acompanhantes/brasil/porto-alegre");
    }
    // Adicione mais condições para outras palavras-chave de acompanhantes e cidades
  }, [routeKeyword, router]);

  if (!keyword) {
    return <div>Carregando...</div>;
  }

  const formattedKeyword = formatKeyword(keyword);

  let content;
  if (
    keyword?.includes("clínica médica") ||
    keyword?.includes("medico") ||
    keyword?.includes("consultório médico") ||
    keyword?.includes("hospital")
  ) {
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica Médica)</p>;
  } else if (keyword?.includes("clínica de estética")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica de Estética)</p>;
  } else if (keyword?.includes("reforma residencial") || keyword?.includes("reforma de apartamento") || keyword?.includes("reforma de casa")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Reforma Residencial)</p>;
  } else if (keyword?.includes("arquitetura")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Arquitetura Geral)</p>;
  } else {
    content = <p>Veja mais conteúdos sobre {formattedKeyword}</p>;
  }

  return (
    <div className="overflow-hidden w-full bg-gray-100">
  
      <main className="pt-16">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-4">{formattedKeyword}</h1>
          {content}
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return topKeywords.map((keyword) => ({
    keyword: keyword.replace(/ /g, '-'),
  }));
}
*/


/*
"use client";

import Script from "next/script";
import Header from "@/components/Header";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const topKeywords = [
  "arquitetura tropical",
  "acompanhantes sao paulo", // Exemplo de palavra-chave relacionada a acompanhantes
  // ... seus outros termos
];

const formatKeyword = (keyword: string) => {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
};

export default function KeywordPage() {
  const { keyword: routeKeyword } = useParams();
  const [keyword, setKeyword] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolvedKeyword = (routeKeyword as string)?.replace(/-/g, ' ') || null;
    setKeyword(resolvedKeyword);

    if (resolvedKeyword?.includes("acompanhantes sao paulo")) {
      router.push("/acompanhantes/brasil/sao-paulo");
    }
    // Adicione mais condições para outras palavras-chave de acompanhantes e suas respectivas URLs
  }, [routeKeyword, router]);

  if (!keyword) {
    return <div>Carregando...</div>;
  }

  const formattedKeyword = formatKeyword(keyword);

  let content;
  if (
    keyword?.includes("clínica médica") ||
    keyword?.includes("medico") ||
    keyword?.includes("consultório médico") ||
    keyword?.includes("hospital")
  ) {
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica Médica)</p>;
  } else if (keyword?.includes("clínica de estética")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica de Estética)</p>;
  } else if (keyword?.includes("reforma residencial") || keyword?.includes("reforma de apartamento") || keyword?.includes("reforma de casa")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Reforma Residencial)</p>;
  } else if (keyword?.includes("arquitetura")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Arquitetura Geral)</p>;
  } else {
    content = <p>Veja mais conteúdos sobre {formattedKeyword}</p>;
  }

  return (
    <div className="overflow-hidden w-full bg-gray-100">
  
      <main className="pt-16">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-4">{formattedKeyword}</h1>
          {content}
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return topKeywords.map((keyword) => ({
    keyword: keyword.replace(/ /g, '-'),
  }));
}
*/