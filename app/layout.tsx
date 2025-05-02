import { ReactNode } from "react"; 
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";
import { inter } from "./fonts";
import Header from "@/components/Header";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Indecent.top - Life Style",
  description: "Crie seu perfil grátis, anuncie grátis, conecte suas redes sociais e seja um afiliado ou influencer criador de conteúdo adulto. Cadastre-se agora!",
  keywords: [
    "acompanhantes porto alegre",
    "acompanhantes são paulo",
    "acompanhantes florianópolis",
    "acompanhantes curitiba",
    "acompanhantes rio de janeiro",
    "acompanhantes gramado",
    "acompanhantes canoas",
    "acompanhantes cachoeirinha",
    "acompanhantes são leopoldo",
    "acompanhantes novo hamburgo",
    "acompanhantes caxias do sul",
    "garota de programa porto alegre",
    "garoto de programa porto alegre",
    "garota de programa são paulo",
    "garoto de programa são paulo",
    "conteúdo adulto",
    "plataforma de afiliados",
    "criadores de conteúdo",
    "live ao vivo",
    "acompanhantes",
    "indecent.top",
    "cadastro grátis",
    "assinatura premium",
    "OnlyFans brasileiro",
    "www.onlyfans.com",
    "onlyfans",
    "rede de afiliados para adultos",
    "www.privacy.com",
    "privacy",
    "xvideos",
    "www.xvideos.com",
    "socaseiras",
    "www.socadseiras.com.br",
    "conteudo adulto",
    "hentai",
    "amador",
    "lésbica",
    "milf",
    "cosplay",
    "femdom",
    "dominição",
    "inversão de papéis",
    "lcasal bi",
    "lésbica",
    "sexo",
    "putaria",
    "swing",
    "troca de casais",

  ],
  openGraph: {
    type: "website",
    url: "https://www.indecent.top",
    title: "Indecent.top - Life Style",
    description: "Crie seu perfil grátis, anuncie grátis, conecte suas redes sociais e seja um influencer ou afiliado criador de conteúdo adulto.",
    images: [
      {
        url: "/og-image.jpg",
        alt: "Indecent.top - Life Style",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@indecenttop",
    title: "Indecent.top - Seja um influencer afiliado criador de conteúdo adulto",
    description: "Crie seu perfil grátis e conecte suas redes sociais agora!",
    images: "/twitter-image.jpg",
  },
  icons: {
    icon: "/indecent-top-logo.png",
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
               
       
       
      <body className={inter.className}>
      <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Indecent.top",
            url: "https://www.indecent.top",
            description: "Life Style",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.indecent.top/search?q={search_term}",
              "query-input": "required name=search_term",
            },
          })}
        </Script>

        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XH8PPH6CQ7`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XH8PPH6CQ7');
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
              "name": "Camila Chalon Arquitetura",
              "headline": metadata.title,
              "description": metadata.description,
              "url": "https://www.indecent.top",
              "logo": "https://www.indecent.top/logo.png",
              "image":[
                {
                  url: "https://www.indecent.top/opengraph-image.png",
                  width: 1200,
                  height: 630,
                  alt: "Projeto de arquitetura de interiores em Porto Alegre",
                },
                {
                  url: "https://www.indecent.top/opengraph-image.png",
                  width: 1200,
                  height: 630,
                  alt: "Reforma de clínica médica em Porto Alegre",
                },
                {
                  url: "https://www.indecent.top/opengraph-image.png",
                  width: 1200,
                  height: 630,
                  alt: "Consultoria de design de interiores",
                },
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Assis Brasil, 3535/411",
                "addressLocality": "Porto Alegre",
                "addressRegion": "RS",
                "postalCode": "91010-007",
                "addressCountry": "BR"
              },
              "author": {
                "@type": "Person",
                "name": "Camila Chalon",
              },
              "datePublished": "2024-11-10",
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
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "ImageObject",
            "url": "https://www.indecent.top/opengraph-image.png",
            "width": 1200,
            "height": 630,
            "name": "Projeto de arquitetura de interiores em Porto Alegre",
            "description": "Projeto de arquitetura de interiores em Porto Alegre",
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "ImageObject",
            "url": "https://www.indecent.top/opengraph-image.png",
            "width": 1200,
            "height": 630,
            "name": "Reforma de clínica médica em Porto Alegre",
            "description": "Reforma de clínica médica em Porto Alegre",
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "ImageObject",
            "url": "https://www.indecent.top/opengraph-image.png",
            "width": 1200,
            "height": 630,
            "name": "Consultoria de design de interiores",
            "description": "Consultoria de design de interiores",
          }
        }
      ]
    })
  }}
/>
      <link rel="icon" href="/favicon.ico" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          <Header />
            {children}
            <Toaster richColors />
          </AuthProvider>
   
        </ThemeProvider>
      </body>
    </html>
  );
}

/*


import { ReactNode } from "react"; 
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";
import { inter } from "./fonts";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "indecent.top",
  description: "Aqui tudo pode!",
  icons: {
    icon: "/indecent-top-logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          <Header />
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
*/

/*
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";
import { inter } from "./fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
*/