import { fetchPostsForLocation } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: { country: string; city: string } }) {
  const { country, city } = params;
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);
  const title = `Acompanhantes em ${formattedCity}, ${formattedCountry} | Indecent Top`;
  const description = `Acompanhantes em ${formattedCity}, ${formattedCountry}. Mulheres, homens e trans de luxo. Perfis com fotos, descrição, valor, dote, idade e WhatsApp.`;

  return {
    title,
    description,
    keywords: [
      `acompanhantes ${formattedCity}`,
      `acompanhantes ${formattedCountry}`,
      "acompanhantes de luxo",
      "acompanhantes independentes",
      "acompanhantes trans",
      "acompanhantes verificados"
    ],
    alternates: {
      canonical: `https://www.indecent.top/acompanhantes/${country}/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.indecent.top/acompanhantes/${country}/${city}`,
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

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|-)[\S]/g, (match) => match.toUpperCase());
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

export default async function AcompanhantesPage({ params }: Params) {
  const { country, city } = params;
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);

  let posts: Post[] = [];
  try {
    const rawPosts = await fetchPostsForLocation(formattedCity, formattedCountry, 12);
    posts = rawPosts.map((rawPost: any) => ({
      id: rawPost.id,
      nome: rawPost.nome || "Sem nome",
      caption: rawPost.caption || "",
      fileUrls: rawPost.fileUrls || [],
      country: capitalizeWords(rawPost.country) || "",
      city: capitalizeWords(rawPost.city) || "",
      whatsapp: rawPost.whatsapp || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black/10 font-custom">
      <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-4">
          Acompanhantes em {formattedCity}, {formattedCountry}
        </h1>
        <p className="mb-6 text-center">
          Encontre <strong>acompanhantes de luxo</strong> em {formattedCity}, {formattedCountry}. Mulheres, homens e trans verificados com fotos reais, descrições completas, valores, idade e contato direto por WhatsApp. Experiências exclusivas com discrição e elegância.
        </p>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="rounded-lg shadow-md overflow-hidden flex flex-col bg-white">
                <Link href={`/${post.nome?.toLowerCase().replace(/\s+/g, '-') || 'perfil'}`}>
                  <div className="relative w-full aspect-[9/16] cursor-pointer">
                    <Image
                      src={post.fileUrls[0] || "/placeholder.jpg"}
                      alt={`Mídia de ${post.nome} - acompanhante em ${post.city}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      priority
                    />
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

        <div className="text-center mt-10 space-y-3">
          <Link href="/acompanhantes/brasil/sao-paulo" className="text-[#EC9EC5]">Veja acompanhantes em São Paulo, Brasil</Link><br />
          <Link href="/acompanhantes/brasil/porto-alegre" className="text-[#EC9EC5]">Veja acompanhantes em Porto Alegre, Brasil</Link><br />
          <Link href="/acompanhantes/brasil/curitiba" className="text-[#EC9EC5]">Veja acompanhantes em Curitiba, Brasil</Link><br />
          <Link href="/acompanhantes/brasil/florianopolis" className="text-[#EC9EC5]">Veja acompanhantes em Florianópolis, Brasil</Link><br />
          <Link href="/acompanhantes/brasil/rio-de-janeiro" className="text-[#EC9EC5]">Veja acompanhantes em Rio de Janeiro, Brasil</Link><br />
          <Link href="/acompanhantes/brasil/belo-horizonte" className="text-[#EC9EC5]">Veja acompanhantes em Belo Horizonte, Brasil</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}


/*
import { fetchPostsForLocation } from "@/lib/data";
import Link from "next/link";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import loadClient from "next/dynamic";

// Carregamento dinâmico do componente que renderiza vídeo/imagem
const MediaPreview = loadClient(() => import("@/components/MediaPreview"), { ssr: false });

export const dynamic = 'force-static'; // continua funcionando

export async function generateMetadata({ params }: { params: { country: string; city: string } }) {
  const { country, city } = params;
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);
  const title = `Acompanhantes em ${formattedCity}, ${formattedCountry} | Indecent Top`;
  const description = `Acompanhantes em ${formattedCity}, ${formattedCountry}. Mulheres, homens e trans de luxo. Perfis com fotos, descrição, valor, dote, idade e WhatsApp.`;

  return {
    title,
    description,
    keywords: [`acompanhantes ${formattedCity}`, `acompanhantes ${formattedCountry}`, "acompanhantes de luxo", "acompanhantes independentes", "acompanhantes trans", "acompanhantes verificados"],
    alternates: {
      canonical: `https://www.indecent.top/acompanhantes/${country}/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.indecent.top/acompanhantes/${country}/${city}`,
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

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|-)[\S]/g, (match) => match.toUpperCase());
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

export default async function AcompanhantesPage({ params }: Params) {
  const { country, city } = params;
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);

  let posts: Post[] = [];
  try {
    const rawPosts = await fetchPostsForLocation(formattedCity, formattedCountry, 12);
    posts = rawPosts.map((rawPost: any) => ({
      id: rawPost.id,
      nome: rawPost.nome || "Sem nome",
      caption: rawPost.caption || "",
      fileUrls: rawPost.fileUrls || [],
      country: capitalizeWords(rawPost.country) || "",
      city: capitalizeWords(rawPost.city) || "",
      whatsapp: rawPost.whatsapp || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/10 font-custom">
      <Suspense fallback={<PostsSkeleton />}>
        <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-4">
            Acompanhantes em {formattedCity}, {formattedCountry}
          </h1>
          <p className="mb-6">
            Encontre <strong>acompanhantes de luxo</strong> em {formattedCity}, {formattedCountry}. Mulheres, homens e trans verificados com fotos reais, descrições completas, valores, idade e contato direto por WhatsApp. Experiências exclusivas com discrição e elegância.
          </p>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-lg shadow-md overflow-hidden flex flex-col">
                  <Link href={`/${post.nome?.toLowerCase().replace(/\s+/g, '-') || 'perfil'}`}>
                    <div className="relative w-full aspect-[9/16] cursor-pointer">
                      <MediaPreview
                        url={post.fileUrls[0]}
                        alt={`Mídia de ${post.nome} - acompanhante em ${post.city}`}
                      />
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              Nenhum anúncio encontrado para {formattedCity}, {formattedCountry}.
            </p>
          )}

          <div className="text-center mt-10 space-y-3">
            <Link href="/acompanhantes/brasil/sao-paulo" className="text-[#EC9EC5]">Veja acompanhantes em São Paulo, Brasil</Link>
            <Link href="/acompanhantes/brasil/porto-alegre" className="text-[#EC9EC5]">Veja acompanhantes em Porto Alegre, Brasil</Link>
            <Link href="/acompanhantes/brasil/curitiba" className="text-[#EC9EC5]">Veja acompanhantes em Curitiba, Brasil</Link>
            <Link href="/acompanhantes/brasil/florianopolis" className="text-[#EC9EC5]">Veja acompanhantes em Florianópolis, Brasil</Link>
            <Link href="/acompanhantes/brasil/rio-de-janeiro" className="text-[#EC9EC5]">Veja acompanhantes em Rio de Janeiro, Brasil</Link>
            <Link href="/acompanhantes/brasil/belo-horizonte" className="text-[#EC9EC5]">Veja acompanhantes em Belo Horizonte, Brasil</Link>
          </div>
        </div>
      </Suspense>
      <Footer />
    </div>
  );
}
*/
/*
import { fetchPostsForLocation } from "@/lib/data";
import ImageWithErrorHandler from "@/components/ImageWithErrorHandler";
import Link from "next/link";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";

export async function generateMetadata({ params }: { params: { country: string; city: string } }) {
  const { country, city } = params;

  return {
    title: `Acompanhantes em ${city}, ${country} | Indecent Top`,
    description: `Descubra acompanhantes em ${city}, ${country}. Navegue por perfis exclusivos com fotos, descrições e contato direto via WhatsApp.`,
    alternates: {
      canonical: `https://indecent.top/acompanhantes/${country}/${city}`,
    },
    openGraph: {
      title: `Acompanhantes em ${city}, ${country} | Indecent Top`,
      description: `Descubra acompanhantes em ${city}, ${country}. Navegue por perfis exclusivos com fotos, descrições e contato direto via WhatsApp.`,
      url: `https://indecent.top/acompanhantes/${country}/${city}`,
      siteName: "Indecent Top",
      type: "website",
    },
  };
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

// Função para normalizar strings
function capitalizeWords(str: string): string {
  return str
    .toLowerCase() // Converte tudo para minúsculas
    .replace(/(?:^|\s|-)\S/g, match => match.toUpperCase()); // Capitaliza a primeira letra de cada palavra
}


export default async function AcompanhantesPage({ params }: Params) {
  const { country, city } = params;

  // Normalizar entradas
  const formattedCity = capitalizeWords(city);
  const formattedCountry = capitalizeWords(country);

  let posts: Post[] = [];
  try {
    // Fetch de dados com entradas normalizadas
    const rawPosts = await fetchPostsForLocation(formattedCity, formattedCountry,10);

    // Normalizar também os dados recebidos do back-end
    posts = rawPosts.map((rawPost: any) => ({
      id: rawPost.id,
      nome: rawPost.nome || "Sem nome",
      caption: rawPost.caption || "",
      fileUrls: rawPost.fileUrls || [],
      country:  capitalizeWords(rawPost.country) || "",
      city:  capitalizeWords(rawPost.city) || "",
      whatsapp: rawPost.whatsapp || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
  }

  return (
    <>
 
      <title>{`Acompanhantes em ${city}, ${country} | Indecent Top`}</title>
      <meta
        name="description"
        content={`Descubra acompanhantes em ${city}, ${country}. Navegue por perfis exclusivos com fotos, descrições e contato direto via WhatsApp. Experiência única garantida!`}
      />
      <meta name="keywords" content={`acompanhantes ${city}, acompanhantes ${country}, acompanhantes luxo, acompanhantes independentes, acompanhantes online`} />
      <meta property="og:title" content={`Acompanhantes em ${city}, ${country} | Indecent Top`} />
      <meta property="og:description" content={`Descubra as melhores acompanhantes em ${city}, ${country}. Perfis exclusivos e contato direto via WhatsApp.`} />
      <meta property="og:url" content={`https://indecent.top/${country}/${city}`} />
      <meta property="og:image" content="/path/to/og-image.jpg" />
      <meta name="robots" content="index, follow" />
 
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center dark:bg-black/10 bg-white md:bg-fixed font-custom">
      <Suspense fallback={<PostsSkeleton />}>
        <div className="text-gray-600 rounded-lg p-6 max-w-6xl w-full shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-2">
          Acompanhantes em {formattedCity}, {formattedCountry}.
          </h1>
          <h1>
          Descubra o Prazer da Exclusividade.

          Bem-vindo ao Indecent.top, o destino definitivo para quem busca experiências inesquecíveis com acompanhantes de alto padrão, on line, ao vivo, chat ou vídeo chamada. Seja qual for sua localização, {formattedCity}, {formattedCountry}  ou qualquer lugar do mundo – aqui você encontrará companhia à altura dos seus desejos.

          👠 Mulheres elegantes
          🕴 Homens sedutores
          🌟 Acompanhantes trans e não-binários encantadores

          Cada perfil é cuidadosamente selecionado para proporcionar a você sofisticação, discrição e momentos de puro deleite. Seja para um evento exclusivo, um jantar refinado ou uma noite de puro prazer, selecionamos e verificamos acompanhantes sabem como transformar cada instante em uma experiência luxuosa e memorável.

          🌍 Onde quer que esteja, a experiência perfeita espera por você.

          🔞 Acesse, escolha e viva o extraordinário.

          ✨ Indecent.top – O luxo da escolha, o prazer da exclusividade.

          </h1>
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                     <Link
                      href="/api/auth/signin"
                      className="text-blue-500 font-medium text-sm mt-4"
                    >
                    <div className="relative w-full aspect-[9/16] cursor-pointer">
                      <ImageWithErrorHandler
                        src={post.fileUrls[0]}
                        alt={post.caption || "Imagem do Post"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="sm:rounded-md object-cover"
                        unoptimized
                      />
                    </div>
                    </Link>
                  <div className="p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-2">
                      {post.nome || "Sem Nome"}
                    </h2>
                    <p>{post.city || "Sem informação de cidade"}</p>
                    <p>{post.country || "Sem informação de país"}</p>
                    <p>{post.caption || "Sem legenda"}</p>
                    <p className="pr-2 pl-0">
                      <a
                        href={`https://wa.me/${post.whatsapp}?text=${encodeURIComponent(
                          "Olá! Encontrei você no www.indecent.top, podemos conversar?"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp className="w-5 h-5 text-green-500 inline-block" />
                      </a>
                    </p>
                    <Link
                      href="/api/auth/signin"
                      className="text-[#EC9EC5] font-medium text-sm mt-4"
                    >
                      Veja mais
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              Nenhum anúncio encontrado para {city}, {country}.
            </p>
          )}
          <div className="text-center mt-6">
          <Link href="/acompanhantes/brasil/sao-paulo" className="text-[#EC9EC5]">
            Veja acompanhantes em São Paulo, Brasil
          </Link>
          </div>
          <div className="text-center mt-6">
          <Link href="/acompanhantes/brasil/porto-alegre" className="text-[#EC9EC5]">
            Veja acompanhantes em Porto Alegre, Brasil
          </Link>
          </div>
          <div className="text-center mt-6">
          <Link href="/acompanhantes/brasil/curitiba" className="text-[#EC9EC5]">
            Veja acompanhantes em Cutitiba, Brasil
          </Link>
          </div> <div className="text-center mt-6">
          <Link href="/acompanhantes/brasil/florianopolis" className="text-[#EC9EC5]">
            Veja acompanhantes em Florianópois, Brasil
          </Link>
          </div> <div className="text-center mt-6">
          <Link href="/acompanhantes/brasil/rio-de-janeiro" className="text-[#EC9EC5]">
            Veja acompanhantes em Rio de Janeiro, Brasil
          </Link>
          </div> <div className="text-center mt-6">
          <Link href="/acompanhantes/brasil/belo-horizonte" className="text-[#EC9EC5]">
            Veja acompanhantes em Belo Horizonte, Brasil
          </Link>
          </div>
        </div>
      </Suspense>
      <Footer />
    </div>
    </>
  );
}
*/
