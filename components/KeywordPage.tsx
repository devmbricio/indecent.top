"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface KeywordData {
  id: number;
  name: string;
  countrySlug?: string | null;
  citySlug?: string | null;
}

export default function KeywordPage() {
  const { keyword } = useParams();
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKeywordData = async () => {
      setLoading(true);
      setError(null);
      setKeywordData(null);
      setRedirectTo(null); // Resetar o redirectTo ao buscar novos dados

      try {
        const response = await fetch(`/api/keywords/${keyword}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || "Erro ao buscar dados");
        }

        const data = await response.json();
        setKeywordData(data.data);

        // Determinar o redirectTo com base nos dados da API
        if (data.data?.countrySlug && data.data?.citySlug && data.data.citySlug !== 'default-city') {
          setRedirectTo(`/acompanhantes/${data.data.countrySlug}/${data.data.citySlug}`);
        } else if (data.data?.countrySlug) {
          setRedirectTo(`/acompanhantes/${data.data.countrySlug}/sao-paulo`); // Exemplo padrão
        } else if (keyword === 'brasil') {
          setRedirectTo('/acompanhantes/brasil/sao-paulo');
        } else if (keyword.includes('porto-alegre')) {
          setRedirectTo('/acompanhantes/brasil/porto-alegre');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordData();
  }, [keyword]);

  const handleGoToAcompanhantes = () => {
    if (typeof keyword === 'string') {
      const parts = keyword.split('-');
      if (parts.length >= 2) {
        const countrySlug = parts[parts.length - 1];
        // A cidade são todos os segmentos exceto o primeiro (se for uma palavra-chave genérica) e o último (o país)
        const citySlugParts = parts.slice(parts.length > 2 ? 1 : 0, parts.length - 1);
        const citySlug = citySlugParts.join('-');

        if (countrySlug && citySlug) {
          router.push(`/acompanhantes/${countrySlug}/${citySlug}`);
          return;
        } else if (countrySlug && parts.length === 1) {
          router.push(`/acompanhantes/${countrySlug}/sao-paulo`); // Fallback com país
          return;
        }
      }
    }
    // Lógica de fallback geral
    router.push('/acompanhantes/brasil/sao-paulo');
  };

  const buttonText = () => {
    if (redirectTo) {
      const parts = redirectTo.split('/');
      if (parts.length === 4 && parts[1] === 'acompanhantes') {
        const countryFormatted = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
        const cityParts = parts[3].split('-');
        const cityFormatted = cityParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return `Ir para Acompanhantes em ${cityFormatted}, ${countryFormatted}`;
      } else if (parts.length === 3 && parts[1] === 'acompanhantes') {
        const countryFormatted = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
        return `Ir para Acompanhantes no ${countryFormatted}`;
      }
    } else if (typeof keyword === 'string') {
      const parts = keyword.split('-');
      if (parts.length >= 2) {
        const countryFormatted = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
        // A cidade são todos os segmentos exceto o primeiro (se for genérico) e o último
        const cityParts = parts.slice(parts.length > 2 ? 1 : 0, parts.length - 1);
        const cityFormatted = cityParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return `Ir para Acompanhantes em ${cityFormatted}, ${countryFormatted}`;
      } else if (parts.length === 1) {
        const countryFormatted = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        return `Ir para Acompanhantes no ${countryFormatted}`;
      }
    }
    return "Ir para Acompanhantes";
  };

  if (loading) {
    return <p className="text-gray-600">Carregando dados...</p>;
  }

  if (error) {
    return (
      <div className="text-gray-600">
        <p>Erro ao carregar dados: {error}</p>
        <button
          onClick={handleGoToAcompanhantes}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          {buttonText()} {/* Chame a função para obter o texto dinâmico */}
        </button>
      </div>
    );
  }

  if (!keywordData) {
    return (
      <div className="text-gray-600">
        <p>Palavra-chave não encontrada.</p>
        <button
          onClick={handleGoToAcompanhantes}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          {buttonText()} {/* Chame a função para obter o texto dinâmico */}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Detalhes da Palavra-chave: {keywordData.name}</h1>
      {/* Renderize os dados da sua palavra-chave aqui */}
      {keywordData?.id && <p>ID: {keywordData.id}</p>}
      {keywordData?.countrySlug && <p>País Slug: {keywordData.countrySlug}</p>}
      {keywordData?.citySlug && <p>Cidade Slug: {keywordData.citySlug}</p>}
      {/* ... outros dados */}
    </div>
  );
}


/*
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface KeywordData {
  id: number;
  name: string;
  countrySlug?: string | null;
  citySlug?: string | null;
  // ... outras propriedades
}

export default function KeywordPage() {
  const { keyword } = useParams(); // keyword é do tipo string
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKeywordData = async () => {
      setLoading(true);
      setError(null);
      setKeywordData(null);

      try {
        const response = await fetch(`/api/keywords/${keyword}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || "Erro ao buscar dados");
        }

        const data = await response.json();
        setKeywordData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordData();
  }, [keyword]);

  const handleGoToAcompanhantes = () => {
    if (typeof keyword === 'string') {
      const parts = keyword.split('-');
      if (parts.length >= 2 && parts[0] === 'acompanhantes') {
        const country = parts[1];
        const city = parts.slice(2).join('-');
        if (country && city) {
          router.push(`/acompanhantes/${country}/${city}`);
          return;
        } else if (country) {
          router.push(`/acompanhantes/${country}/sao-paulo`);
          return;
        }
      } else if (keyword === 'brasil') {
        router.push('/acompanhantes/brasil/sao-paulo');
        return;
      } else if (keyword.includes('porto-alegre')) {
        router.push('/acompanhantes/brasil/porto-alegre');
        return;
      }
      router.push('/acompanhantes/brasil/sao-paulo'); // Fallback
    } else {
      console.error("Erro: keyword não é uma string", keyword);
      // Lógica para lidar com o caso em que keyword não é string
      router.push('/acompanhantes/brasil/sao-paulo'); // Fallback seguro
    }
  };

  if (loading) {
    return <p className="text-gray-600">Carregando dados...</p>;
  }

  if (error) {
    return (
      <div className="text-gray-600">
        <p>Erro ao carregar dados: {error}</p>
        <button
          onClick={handleGoToAcompanhantes}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Ir para Acompanhantes
        </button>
      </div>
    );
  }

  if (!keywordData) {
    return (
      <div className="text-gray-600">
        <p>Palavra-chave não encontrada.</p>
        <button
          onClick={handleGoToAcompanhantes}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Ir para Acompanhantes
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Detalhes da Palavra-chave: {keywordData.name}</h1>
   
      {keywordData.id && <p>ID: {keywordData.id}</p>}
      {keywordData.countrySlug && <p>País Slug: {keywordData.countrySlug}</p>}
      {keywordData.citySlug && <p>Cidade Slug: {keywordData.citySlug}</p>}
   
    </div>
  );
}
*/

/*


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
*/