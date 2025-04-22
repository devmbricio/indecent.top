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
    content = <p>Conteúdo genérico sobre {formattedKeyword}</p>;
  }

  return (
    <div className="overflow-hidden w-full bg-gray-100">
      {/* Google Analytics Script (mantido) */}
      <main className="pt-16">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-4">{formattedKeyword} em Porto Alegre</h1>
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

/*



// app/[keyword]/page.tsx
"use client";

import Script from "next/script";
import Header from "@/components/Header";
import { useRouter, useParams } from "next/navigation"; // Importe useParams aqui
import { useEffect, useState } from "react";
import AcompanhantesPage from "@/app/acompanhantes/[country]/[city]/page";


// Importe seus componentes específicos para cada tipo de projeto
// Exemplo:
// import ReformaClinicaMedica from "@/components/ReformaClinicaMedica";
// import ProjetoClinicaEstetica from "@/components/ProjetoClinicaEstetica";
// import ReformaResidencialGeral from "@/components/ReformaResidencialGeral";


// Array de termos de pesquisa (substitua com seus 50 termos)
const topKeywords = [
"arquitetura tropical",
  // ... seus outros 46 termos
];

// Função para formatar o termo para ser usado como título e conteúdo
const formatKeyword = (keyword: string) => {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
};

export default function KeywordPage() {
  const { keyword: routeKeyword } = useParams(); // Obtém o parâmetro 'keyword' da rota
  const [keyword, setKeyword] = useState<string | null>(null);

  useEffect(() => {
    setKeyword((routeKeyword as string)?.replace(/-/g, ' ') || null);
  }, [routeKeyword]);

  if (!keyword) {
    return <div>Carregando...</div>;
  }

  const formattedKeyword = formatKeyword(keyword);

  // Lógica para renderizar componentes diferentes com base no keyword
  let content;
  if (
    keyword.includes("clínica médica") ||
    keyword.includes("medico") ||
    keyword.includes("consultório médico") ||
    keyword.includes("hospital") // Adicione outros termos médicos relevantes
  ) {
    content = <AcompanhantesPage keyword={keyword} />;
  } else if (keyword.includes("clínica de estética")) {
    // content = <ProjetoClinicaEstetica keyword={keyword} />;
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica de Estética)</p>;
  } else if (keyword.includes("reforma residencial") || keyword.includes("reforma de apartamento") || keyword.includes("reforma de casa")) {
    // content = <ReformaResidencialGeral keyword={keyword} />;
    content = <p>Conteúdo sobre {formattedKeyword} (Reforma Residencial)</p>;
  } else if (keyword.includes("arquitetura")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Arquitetura Geral)</p>;
  } else {
    content = <p>Conteúdo genérico sobre {formattedKeyword}</p>;
  }

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
   
      <main className="pt-16">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-4">{formattedKeyword} em Porto Alegre</h1>
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

/*

// app/[keyword]/page.tsx
"use client";

import Script from "next/script";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Importe seus componentes específicos para cada tipo de projeto
// Exemplo:
// import ReformaClinicaMedica from "@/components/ReformaClinicaMedica";
// import ProjetoClinicaEstetica from "@/components/ProjetoClinicaEstetica";
// import ReformaResidencialGeral from "@/components/ReformaResidencialGeral";

// Array de termos de pesquisa (substitua com seus 50 termos)
const topKeywords = [
 "arquiteturaprojeto e reforma",
"arquitetura e urbanismo",
"arquitetoprojeto arquitetonico",
"arquiteta",
"escritorio de arquitetura",
"escritório de arquitetura",
"arquitetura de interiores",
"arquitetura corporativa",
"projeto de arquitetura",
"escritorio de arquitetura são paulo",
"arquitetura comercial",
"arquiteto de interiores",
"projetos arquitetonicos",
"empresa de arquitetura",
"projeto 3d arquitetura",
"belas artes arquitetura",
"arquitetos em são paulo",
"projeto arquitetura",
"arquitetura e design de interiores",
"arquitetura anhanguera",
"site de arquitetura",
"doma arquitetura",
"arquitetos porto alegre",
"arquiteto sao paulo",
"arquiteto em são paulo",
"escritorio arquitetura",
"arquitetura e urbanismo presencial",
"arquitetos sao paulo",
"site arquitetura",
"projeto arquitetonico completo",
"arquitetura e urbanismo anhanguera",
"arquitetura belas artes",
"arquiteto porto alegre",
"arquitetura paisagista",
"arquiteto on line",
"arquitetos em sao paulo",
"arquitetura de soluções",
"arquiteto são paulo",
"arquitetura interiores",
"arquitetura sustentavel",
"arquitetura escritorio",
"arquitetura moderna",
"arquiteto preço popular",
"arquitetura projetos",
"arquitetos são paulo",
"projeto arquitetonico preço",
"escritório de arquitetura em são paulo",
"projeto arquitetonico residencial",
"arquitetos em porto alegre",
"escritório arquitetura",
"arquitetura 3d",
"lina bo bardi",
"projetos arquitetonicos prontos",
"arquitetura em sao paulo",
"serviços de arquitetura",
"arquitetura e construção",
"arquitetura e interiores",
"arquitetura de casas",
"orçamento arquitetura",
"casa do arquiteto",
"unopar arquitetura",
"arquiteto para reforma",
"arquitetura e design",
"arquitetura industrial",
"arquitetos de interiores",
"arquitetos em ribeirão preto",
"arquitetura de varejo",
"arquitetura empresarial",
"arquitetura de bolso",
"arquitetura residencial",
"arquiteto em santo andre",
"una arquitetura e urbanismo",
"projeto de reforma residencial",
"arquitetos portugueses",
"arquitetura e decoração",
"engenheiro arquiteto",
"puc arquitetura e urbanismo",
"arquiteto ribeirão preto",
"bim arquitetura",
"revit arquitetura",
"projeto executivo arquitetura",
"escritorio arquitetura sao paulo",
"empresa arquitetural",
"lista de arquitetos em são paulo",
"arquitetura unopar",
"arquiteto belo horizonte",
"projeto de arquitetura de interiores",
"arquiteto corporativo",
"arquitetura site",
"arquiteto e designer de interiores",
"a arquiteta",
"arquitetos de bolso",
"arquitetos famosos",
"blender para arquitetura 2.0",
"orçamento projeto arquitetura",
"arquiteto urbanista",
"site de projetos de arquitetura",
"arquiteto virtual",
"projeto de arquitetura preço",
"3d arquitetura",
"rrt arquitetura",
"arquitetura e paisagismo",
"etapas de um projeto arquitetônico",
"arquitetura design de interiores",
"orçamento de arquitetura",
"studio de arquitetura",
"arquitetura microserviços",
"pita arquitetura",
"arquiteto projetista",
"arquitetura popular",
"arquitetura de restaurantes",
"projetos de arquitetura residencial",
"projetos arquitetônicos",
"renata pocztaruk",
"melhores arquitetos de sao paulo",
"site para arquitetos",
"arquitetura de casa",
"arquiteto homem",
"arquitetura de sistemas",
"sustentabilidade na arquitetura",
"arquitetura limpa",
"arquitetura e urbanismo quantos anos",
"projeto reforma",
"projetos de reforma de casas",
"arquiteto e engenheiro",
"arquitetura design",
"studio arquitetura",
"arquitetura modular",
"preço projeto arquitetura",
"horas complementares arquitetura",
"arquitetura de casas modernas",
"projeto arquitetura preço",
"preço arquiteto",
"arquitetura acessivel",
"arquitetura e sustentabilidade",
"arquitetura ou design de interiores",
"mayresse arquitetura",
"projetos arquitetônicos prontos",
"preço de projeto de arquitetura",
"acompanhamento de obra arquiteto",
"arquitetura japonesa",
"arquitetura de cozinha",
"arquitetura de casas simples",
"projeto reforma apartamento",
"arquitetura quantos anos",
"arquitetura da informação",
"arquitetura moderna casas",
"arquitetura casa",
"apresentação de projeto de interiores",
"arquiteto preço",
"ospa arquitetura",
"apresentação de projeto arquitetura",
"portobello arquitetura",
"arquitetura contemporânea",
"design de interiores ou arquitetura",
"atie arquitetura",
"preço projeto arquitetura interiores m2",
"arquitetura e reforma",
"arquitetura consultorio medico",
"preço projeto arquitetonico",
"arquitetura biofilica",
"arquitetura casas modernas",
"projetista arquitetura",
"construtora contrata arquiteto",
"arthur casas arquitetos",
"sobre arquitetura",
"custo projeto arquitetura",
"maquete arquitetura",
"arquitetura decoração",
"reforma arquitetura",
"arquitetos paisagistas",
"arquitetura de solução",
"atelier de arquitetura",
"atelier arquitetura",
"projetos e reformas residenciais",
"archdaily projetos",
"etapas projeto arquitetonico",
"bacharel em arquitetura",
"etapas de projeto arquitetonico",
"arquitetura puc minas",
"etapas do projeto arquitetonico",
"atelier arquitectura",
"arquitetura quarto",
"puc minas arquitetura",
"preço de projeto arquitetonico",
"preço de um arquiteto",
"projeto de reforma de apartamento",
"projeto arquitetonico 3d",
"arquitetura para clínicas médicas",
"arquiteto ou design de interiores",
"arquitetura bioclimática",
"detalhamento arquitetura",
"arquitetura reforma apartamento",
"projeto para reforma de apartamento",
"detalhamento para arquitetos",
"projeto para reforma de casas",
"projetos de reforma",
"arquitetura cozinha",
"arquitetura brasileira",
"unifesp arquitetura",
"arquitetos brasileiros",
"casas arquitetura moderna",
"44 arquitetura",
"a arquitetura grega",
"a arquitetura renascentista",
"a arquitetura romana",
"a barriga do arquiteto",
"a77 arquitetura",
"acia arquitetos",
"ad3 arquitetura",
"alencar arquitetura",
"alexandre leite arquiteto",
"ambidestro arquitetura",
"amz arquitetos",
"antonio virzi arquiteto",
"apiacas arquitetura",
"apresentação de projeto arquitetonico",
"apresentação projeto arquitetura",
"archdaily casas pequenas",
"archdaily com br",
"arquitectura paisagista",
"arquitectura tradicional portuguesa",
"arquiteta do masp",
"arquiteta famosa",
"arquiteta masp",
"arquiteta zaha hadid",
"arquitetas brasileiras",
"arquitetas negras",
"arquiteto arthur casas",
"arquiteto autonomo",
"arquiteto calatrava",
"arquiteto da marinha",
"arquiteto da torre eiffel",
"arquiteto david bastos",
"arquiteto do museu do amanhã",
"arquiteto e engenheiro 3d",
"arquiteto engenheiro",
"arquiteto espanhol",
"arquiteto francis kere",
"arquiteto frank gehry",
"arquiteto frank lloyd wright",
"arquiteto gaudi",
"arquiteto isay weinfeld",
"arquiteto japones",
"arquiteto le corbusier",
"arquiteto lelea",
"arquiteto lucio costa",
"arquiteto marcio kogan",
"arquiteto mauricio arruda",
"arquiteto mexicano",
"arquiteto museu do amanha",
"arquiteto niemeyer",
"arquiteto oscar niemeyer",
"arquiteto ou engenheiro",
"arquiteto paulo mendes da rocha",
"arquiteto renato mendonça",
"arquiteto ruy ohtake",
"arquiteto santiago calatrava",
"arquiteto thiago bernardes",
"arquiteto torre eiffel",
"arquiteto vilanova artigas",
"arquiteto zani",
"arquitetonica",
"arquitetonicas",
"arquitetonico",
"arquitetonicos",
"arquitetos angolanos",
"arquitetos brasileiros famosos",
"arquitetos contemporâneos",
"arquitetos contemporâneos brasileiros",
"arquitetos de belo horizonte",
"arquitetos do renascimento",
"arquitetos famosos atuais",
"arquitetos famosos brasileiros",
"arquitetos japoneses",
"arquitetos modernos",
"arquitetos negros",
"arquitetos renomados",
"arquitetura 2022",
"arquitetura aberta",
"arquitetura afetiva",
"arquitetura agressiva",
"arquitetura alemã",
"arquitetura ambiental",
"arquitetura americana",
"arquitetura anos 50",
"arquitetura anos 60",
"arquitetura anos 70",
"arquitetura antiga",
"arquitetura antimendigo",
"arquitetura antroposófica",
"arquitetura asiatica",
"arquitetura asteca",
"arquitetura atemporal",
"arquitetura açoriana",
"arquitetura babilônica",
"arquitetura barroca",
"arquitetura barroca brasileira",
"arquitetura bauhaus",
"arquitetura bimar",
"arquitetura biofílica",
"arquitetura biomimética",
"arquitetura bizantina",
"arquitetura brutalista",
"arquitetura c4",
"arquitetura casas pequenas",
"arquitetura cebola",
"arquitetura chinesa",
"arquitetura chã",
"arquitetura cinematográfica",
"arquitetura circular",
"arquitetura civil",
"arquitetura classica",
"arquitetura clean",
"arquitetura cleopatra",
"arquitetura clinica",
"arquitetura clinica de estetica",
"arquitetura clinica de fisioterapia",
"arquitetura clinica medica",
"arquitetura clinica odontologica",
"arquitetura clinicas",
"arquitetura colombiana",
"arquitetura colonial",
"arquitetura colonial brasileira",
"arquitetura colonial mineira",
"arquitetura colonial portuguesa",
"arquitetura comunista",
"arquitetura construtivista",
"arquitetura consultorio",
"arquitetura contemporanea",
"arquitetura contemporânea residencial",
"arquitetura coreana",
"arquitetura cubista",
"arquitetura da felicidade",
"arquitetura da grecia antiga",
"arquitetura da paisagem",
"arquitetura da região sul",
"arquitetura da roma antiga",
"arquitetura das igrejas católicas",
"arquitetura de casas pequenas",
"arquitetura de clinica",
"arquitetura de clinicas medicas",
"arquitetura de consultorio medico",
"arquitetura de ferro",
"arquitetura de igrejas",
"arquitetura de informação",
"arquitetura de machu picchu",
"arquitetura de micro serviços",
"arquitetura de microserviços",
"arquitetura de oscar niemeyer",
"arquitetura de projetos",
"arquitetura de quarto",
"arquitetura de referencia",
"arquitetura de repositório",
"arquitetura de roma",
"arquitetura de segurança",
"arquitetura de sistemas de informação",
"arquitetura de são paulo",
"arquitetura do ferro",
"arquitetura do renascimento",
"arquitetura dórica",
"arquitetura e",
"arquitetura e jardim",
"arquitetura e reforma de casas",
"arquitetura e tecnologia",
"arquitetura e urbanismo em ingles",
"arquitetura e urbanismo puc minas",
"arquitetura ecletica",
"arquitetura ecologica",
"arquitetura ecológica",
"arquitetura egipcia",
"arquitetura egípcia",
"arquitetura em ferro",
"arquitetura em ingles",
"arquitetura em madeira",
"arquitetura erudita",
"arquitetura escandinava",
"arquitetura esportiva",
"arquitetura europeia",
"arquitetura evolutiva",
"arquitetura exatas ou humanas",
"arquitetura expressionista",
"arquitetura francesa",
"arquitetura futurista",
"arquitetura georgiana",
"arquitetura germanica",
"arquitetura grecia antiga",
"arquitetura greco romana",
"arquitetura grega",
"arquitetura grega antiga",
"arquitetura grega e romana",
"arquitetura gui mattos",
"arquitetura gótica",
"arquitetura gótica e românica",
"arquitetura haussmanniana",
"arquitetura historicista",
"arquitetura histórica",
"arquitetura holandesa",
"arquitetura humanas ou exatas",
"arquitetura humanizada",
"arquitetura inca",
"arquitetura inclusiva",
"arquitetura indiana",
"arquitetura industrial residencial",
"arquitetura ingles",
"arquitetura inglesa",
"arquitetura inteligente",
"arquitetura islamica",
"arquitetura islâmica",
"arquitetura italiana",
"arquitetura kitsch",
"arquitetura maneirista",
"arquitetura manuelina",
"arquitetura marroquina",
"arquitetura medieval",
"arquitetura medieval românica",
"arquitetura mediterranea",
"arquitetura mediterrânea",
"arquitetura metaverso",
"arquitetura mexicana",
"arquitetura moderna brasileira",
"arquitetura moderna casas térreas",
"arquitetura moderna e contemporânea",
"arquitetura modernista",
"arquitetura monolitica",
"arquitetura monumental",
"arquitetura mourisca",
"arquitetura muçulmana",
"arquitetura na grecia antiga",
"arquitetura neoclássica",
"arquitetura neocolonial",
"arquitetura neogotica",
"arquitetura neolitica",
"arquitetura netflix",
"arquitetura no metaverso",
"arquitetura no renascimento",
"arquitetura noetica",
"arquitetura nordestina",
"arquitetura nordica",
"arquitetura onion",
"arquitetura organicista",
"arquitetura otomana",
"arquitetura ouro preto",
"arquitetura paisagista projetos",
"arquitetura paleocristã",
"arquitetura para crianças",
"arquitetura para reforma de casas",
"arquitetura para todos",
"arquitetura paramétrica",
"arquitetura passiva",
"arquitetura polonesa",
"arquitetura pombalina",
"arquitetura ponta grossa",
"arquitetura portuguesa",
"arquitetura promocional",
"arquitetura pré histórica",
"arquitetura quarto casal",
"arquitetura racionalista",
"arquitetura reforma",
"arquitetura reforma casas",
"arquitetura religiosa",
"arquitetura renascentista",
"arquitetura renascimento",
"arquitetura revivalista",
"arquitetura rococo",
"arquitetura roma",
"arquitetura roma antiga",
"arquitetura romana",
"arquitetura romana antiga",
"arquitetura romanica",
"arquitetura romantica",
"arquitetura românica e gótica",
"arquitetura russa",
"arquitetura rustica",
"arquitetura sagrada",
"arquitetura sala",
"arquitetura sao quantos anos",
"arquitetura sensorial",
"arquitetura sensorial para deficientes",
"arquitetura simples",
"arquitetura sovietica",
"arquitetura stalinista",
"arquitetura surrealista",
"arquitetura tailandesa",
"arquitetura tradicional",
"arquitetura tropical",

];

// Função para formatar o termo para ser usado como título e conteúdo
const formatKeyword = (keyword: string) => {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
};

export default function KeywordPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState<string | null>(null);

  useEffect(() => {
    const path = router.pathname.split('/')[1];
    setKeyword(path?.replace(/-/g, ' ') || null);
  }, [router.pathname]);

  if (!keyword) {
    return <div>Carregando...</div>;
  }

  const formattedKeyword = formatKeyword(keyword);

  // Lógica para renderizar componentes diferentes com base no keyword
  let content;
  if (keyword.includes("clínica médica")) {
    // content = <ReformaClinicaMedica keyword={keyword} />;
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica Médica)</p>;
  } else if (keyword.includes("clínica de estética")) {
    // content = <ProjetoClinicaEstetica keyword={keyword} />;
    content = <p>Conteúdo sobre {formattedKeyword} (Clínica de Estética)</p>;
  } else if (keyword.includes("reforma residencial") || keyword.includes("reforma de apartamento") || keyword.includes("reforma de casa")) {
    // content = <ReformaResidencialGeral keyword={keyword} />;
    content = <p>Conteúdo sobre {formattedKeyword} (Reforma Residencial)</p>;
  } else if (keyword.includes("arquitetura")) {
    content = <p>Conteúdo sobre {formattedKeyword} (Arquitetura Geral)</p>;
  } else {
    content = <p>Conteúdo genérico sobre {formattedKeyword}</p>;
  }

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
            url: `https://www.camilachalon.com.br/${keyword?.replace(/ /g, '-')}`,
            logo: "https://www.camilachalon.com.br/logo.png",
            description: `Projetos de arquitetura e reformas de ${formattedKeyword} em Porto Alegre e região.`,
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
            datePublished: "2025-04-21", // Adapte a data
          }),
        }}
      />

      <Header />
      <main className="pt-16">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-4">{formattedKeyword} em Porto Alegre</h1>
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