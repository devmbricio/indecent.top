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
              <article key={post.id} className="rounded-lg shadow-md overflow-hidden flex flex-col bg-black/10">
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

