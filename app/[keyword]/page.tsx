import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { fetchPostsForLocation } from "@/lib/data";
import { FaWhatsapp } from "react-icons/fa";
import KeywordPage from "@/components/KeywordPage";
import { JobRole } from "@prisma/client";

type RawPost = {
  id: string;
  nome?: string;
  caption?: string;
  fileUrls: string[];
  country: string;
  city: string;
  whatsapp?: string;
  job?: JobRole;
};


export const dynamic = 'force-static';

function capitalizeWords(str?: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|-)[\S]/g, (match) => match.toUpperCase());
}


type Params = {
  params: {
    country: string;
    city: string;
  };
};

type Post = {
  id: string;
  nome: string | null;
  caption: string;
  fileUrls: string[];
  country: string;
  city: string;
  whatsapp: string;
};

export async function generateMetadata({ params }: { params: { country: string; city: string } }) {
  const { country, city } = params;
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);
  const title = `Acompanhantes em ${formattedCity}, ${formattedCountry} | Indecent Top`;
  const description = `Acompanhantes em ${formattedCity}, ${formattedCountry}. Mulheres, homens e trans de luxo. Perfis com fotos, descrição, valor, idade e WhatsApp.`;

  return {
    title,
    description,
    keywords: [
      `acompanhantes ${formattedCity}`,
      `acompanhantes ${formattedCountry}`,
      "acompanhantes de luxo",
      "acompanhantes independentes",
      "acompanhantes trans",
      "acompanhantes verificados",
    ],
    alternates: {
      canonical: `https://www.indecent.top/acompanhantes/${city}/${country}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.indecent.top/acompanhantes/${city}/${country}`,
      siteName: "Indecent Top",
      type: "website",
      images: [
        {
          url: "https://www.indecent.top/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default async function AcompanhantesPage({ params }: Params) {
  const { country, city } = params;
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);
  
  let posts: Post[] = [];
  try {
    const rawPosts = await fetchPostsForLocation(city, country, 12); // <- Aqui corrigido
    posts = rawPosts
    .filter((rawPost: any) => rawPost.whatsapp?.trim() || rawPost.job === "JOB")
    .map((rawPost: any) => ({
      id: rawPost.id,
      nome: rawPost.nome?.trim() || "Acompanhante",
      caption: rawPost.caption || "",
      fileUrls: rawPost.fileUrls || [],
      country: capitalizeWords(rawPost.country) || "",
      city: capitalizeWords(rawPost.city) || "",
      whatsapp: rawPost.whatsapp,
    }));
  
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
  }
  

  const cidadesSugestao = shuffleArray([
    { nome: "São Paulo", slug: "sao-paulo" },
    { nome: "Rio de Janeiro", slug: "rio-de-janeiro" },
    { nome: "Curitiba", slug: "curitiba" },
    { nome: "Belo Horizonte", slug: "belo-horizonte" },
    { nome: "Florianópolis", slug: "florianopolis" },
    { nome: "Porto Alegre", slug: "porto-alegre" },
  ]).slice(0, 4);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black/10 font-custom">
      
      <div className="text-gray-700 rounded-lg p-6 max-w-6xl w-full shadow-lg bg-black/10">
      <div className="flex items-center justify-center text-gray-700 rounded-lg p-6 max-w-6xl w-full shadow-lg bg--black/10">
      <KeywordPage />
      <div/></div>
        <h1 className="text-xl md:text-2xl font-bold text-center mb-4">
          Acompanhantes em {formattedCity}, {formattedCountry}
        </h1>
        <p className="mb-6 text-center">
          Descubra <strong>acompanhantes de luxo</strong> em {formattedCity}, {formattedCountry}. Perfis verificados de mulheres, homens e trans com fotos reais, descrições completas, valores, idade e WhatsApp para contato direto. Discrição e sofisticação em experiências únicas.
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="rounded-lg shadow-md overflow-hidden flex flex-col bg--black/15">
                <Link href={`/${post.nome?.toLowerCase().replace(/\s+/g, '-') || 'perfil'}`}>
                <div className="relative w-full aspect-[9/16] cursor-pointer">
  {post.fileUrls[0]?.match(/\.(mp4|mov|webm)$/i) ? (
    <video
      src={post.fileUrls[0]}
      className="w-full h-full object-cover"
      playsInline
      muted
      loop
      autoPlay
    />
  ) : (
    <Image
      src={post.fileUrls[0] || "/placeholder.jpg"}
      alt={`Foto de ${post.nome || "Acompanhante"} em ${post.city}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 25vw"
      priority
    />
  )}
</div>

                </Link>
                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">{post.nome}</h2>
                  <p className="text-sm text-gray-500">{post.city}, {post.country}</p>
                  <p className="text-sm text-gray-600 mb-2">{post.caption}</p>
                  <a
                    href={`https://wa.me/${post.whatsapp}?text=${encodeURIComponent("Olá! Encontrei você no www.indecent.top, podemos conversar?")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 mt-auto flex items-center gap-2"
                  >
                    <FaWhatsapp /> Conversar
                  </a>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              Nenhum anúncio encontrado para {formattedCity}, {formattedCountry}.
            </p>
          )}
        </section>

        <div className="text-center mt-10 space-y-2">
          <h3 className="font-semibold text-gray-700 mb-2">Outras cidades com acompanhantes:</h3>
          {cidadesSugestao.map((cidade) => (
            <div key={cidade.slug}>
              <Link
                href={`/acompanhantes/brasil/${cidade.slug}`}
                className="text-[#EC9EC5] hover:underline"
              >
                Veja acompanhantes em {cidade.nome}, Brasil
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}



/*
// app/[keyword]/page.tsx
import Header from "@/components/Header";
import KeywordPage from "@/components/KeywordPage";
import Script from "next/script";
import { Metadata } from "next";

type Props = {
  params: {
    keyword: string;
  };
};

function formatKeyword(keyword: string) {
  const formatted = keyword.replace(/-/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = formatKeyword(params.keyword);

  return {
    title: `${keyword} | Projeto e Reforma com Arquitetos Especializados`,
    description: `Confira nossos serviços de ${keyword}. Projetos personalizados de arquitetura, reforma e interiores para transformar seu espaço.`,
    alternates: {
      canonical: `https://www.seusite.com.br/${params.keyword}`,
    },
    openGraph: {
      title: `${keyword} | Projeto e Reforma com Arquitetos Especializados`,
      description: `Veja como transformar espaços com nossos projetos de ${keyword}. Atendimento em todo Brasil.`,
      url: `https://www.seusite.com.br/${params.keyword}`,
      siteName: "Seu Site de Arquitetura",
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default function KeywordsPage() {
  return (
    <div className="overflow-hidden w-full bg-gray-100">
 
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-X14YM769KT"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X14YM769KT');
          `,
        }}
      />

  
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Camila Chalon Arquitetura",
            url: "https://www.camilachalon.com.br",
            logo: "https://www.camilachalon.com.br/logo.png",
            image: [
              {
                url: "https://www.camilachalon.com.br/og-image-1.JPG",
                width: 1200,
                height: 630,
                alt: "Projeto de arquitetura de interiores em Porto Alegre",
              },
              {
                url: "https://www.camilachalon.com.br/og-image-2.JPG",
                width: 1200,
                height: 630,
                alt: "Reforma de clínica médica em Porto Alegre",
              },
              {
                url: "https://www.camilachalon.com.br/opengraph-image.jpg",
                width: 1200,
                height: 630,
                alt: "Consultoria de design de interiores",
              },
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Av. Assis Brasil, 3535/411",
              addressLocality: "Porto Alegre",
              addressRegion: "RS",
              postalCode: "91010-007",
              addressCountry: "BR",
            },
            author: {
              "@type": "Person",
              name: "Camila Chalon",
            },
            datePublished: "2024-11-10",
          }),
        }}
      />

   
      <Header />
      <main>
        <KeywordPage />
      </main>
    </div>
  );
}
*/


/*

// app/alguma-rota/page.tsx


import Script from "next/script";
import Header from "@/components/Header";
import KeywordPage from "@/components/KeywordPage";

import { Metadata } from "next";

type Props = {
  params: {
    keyword: string;
  };
};

// Função para formatar o título
function formatKeyword(keyword: string) {
  const formatted = keyword.replace(/-/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// METADATA DINÂMICA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const keyword = formatKeyword(params.keyword);

  return {
    title: `${keyword} | Projeto e Reforma com Arquitetos Especializados`,
    description: `Confira nossos serviços de ${keyword}. Projetos personalizados de arquitetura, reforma e interiores para transformar seu espaço.`,
    alternates: {
      canonical: `https://www.seusite.com.br/${params.keyword}`,
    },
    openGraph: {
      title: `${keyword} | Projeto e Reforma com Arquitetos Especializados`,
      description: `Veja como transformar espaços com nossos projetos de ${keyword}. Atendimento em todo Brasil.`,
      url: `https://www.seusite.com.br/${params.keyword}`,
      siteName: "Seu Site de Arquitetura",
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default function ArquitetaReformandoSonhos() {
  return (
    <div className="overflow-hidden w-full bg-gray-100">
     
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-X14YM769KT"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X14YM769KT');
          `,
        }}
      />

 
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Camila Chalon Arquitetura",
            url: "https://www.camilachalon.com.br",
            logo: "https://www.camilachalon.com.br/logo.png",
            image: [
              {
                url: "https://www.camilachalon.com.br/og-image-1.JPG",
                width: 1200,
                height: 630,
                alt: "Projeto de arquitetura de interiores em Porto Alegre",
              },
              {
                url: "https://www.camilachalon.com.br/og-image-2.JPG",
                width: 1200,
                height: 630,
                alt: "Reforma de clínica médica em Porto Alegre",
              },
              {
                url: "https://www.camilachalon.com.br/opengraph-image.jpg",
                width: 1200,
                height: 630,
                alt: "Consultoria de design de interiores",
              },
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Av. Assis Brasil, 3535/411",
              addressLocality: "Porto Alegre",
              addressRegion: "RS",
              postalCode: "91010-007",
              addressCountry: "BR",
            },
            author: {
              "@type": "Person",
              name: "Camila Chalon",
            },
            datePublished: "2024-11-10",
          }),
        }}
      />

   
      <Script
        id="structured-data-carousel"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@type": "ImageObject",
                  url: "https://www.camilachalon.com.br/og-image-1.JPG",
                  width: 1200,
                  height: 630,
                  name: "Projeto de arquitetura de interiores em Porto Alegre",
                  description: "Projeto de arquitetura de interiores em Porto Alegre",
                },
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@type": "ImageObject",
                  url: "https://www.camilachalon.com.br/og-image-2.JPG",
                  width: 1200,
                  height: 630,
                  name: "Reforma de clínica médica em Porto Alegre",
                  description: "Reforma de clínica médica em Porto Alegre",
                },
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@type": "ImageObject",
                  url: "https://www.camilachalon.com.br/opengraph-image.jpg",
                  width: 1200,
                  height: 630,
                  name: "Consultoria de design de interiores",
                  description: "Consultoria de design de interiores",
                },
              },
            ],
          }),
        }}
      />

       
      <Header />
      <main>
        <KeywordPage/>
      </main>
    </div>
  );
}
*/
