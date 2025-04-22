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
      {/* Google Analytics */}
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

      {/* JSON-LD: LocalBusiness */}
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

      {/* JSON-LD: Carrossel de Imagens */}
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

      {/* Header e Conteúdo */}
      <Header />
      <main>
        <KeywordPage/>
      </main>
    </div>
  );
}

