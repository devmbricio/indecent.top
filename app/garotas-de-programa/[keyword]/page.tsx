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
  const title = `Garotas de programa em ${formattedCity}, ${formattedCountry} | Indecent Top`;
  const description = `Garotas de programa em ${formattedCity}, ${formattedCountry}. Mulheres, homens e trans de luxo. Perfis com fotos, descrição, valor, idade e WhatsApp.`;

  return {
    title,
    description,
    keywords: [
      `garotas-de-programa ${formattedCity}`,
      `garotas-de-programa ${formattedCountry}`,
      "garotas-de-programa-de-luxo",
      "garotas-de-programa-independentes",
      "garotas-de-programa-trans",
      "grotas-de-programa-verificadas",
    ],
    alternates: {
      canonical: `https://www.indecent.top/garotas-de-programa/${city}/${country}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.indecent.top/garotas-de-programa/${city}/${country}`,
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
    { nome: "Salvador", slug: "salvador" },
    { nome: "Maceio", slug: "maceio" },
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
                href={`/garotas-de-programa/${cidade.slug}/brasil`}
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

