// app/acompanhantes/[city]/page.tsx
import { fetchPostsForLocation } from "@/lib/data"; // Assumindo que você tem essa função
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import { capitalizeWords } from "@/lib/utils"; // Assumindo uma função de utilidade
import prisma from "@/lib/prisma";

export const dynamic = 'force-static';

type Params = {
  params: {
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

export async function generateMetadata({ params }: Params) {
  const { city } = params;
  const formattedCity = capitalizeWords(city.replace(/-/g, ' '));
  const title = `Acompanhantes em ${formattedCity} | Seu Site`;
  const description = `Encontre acompanhantes em ${formattedCity}.`;

  return {
    title,
    description,
    // ... outras metadados dinâmicas
    alternates: {
      canonical: `https://indecent.top/acompanhantes/${city}`,
    },
  };
}

export async function generateStaticParams() {
   try {
    const cities = await prisma.city.findMany({ /* ... */ });

    return cities.map((city) => ({ city: city.slug }));
  } catch (error) {
    console.error("Erro ao buscar slugs de cidades:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function AcompanhantesCidadePage({ params }: Params) {
  const { city } = params;
  const formattedCity = capitalizeWords(city.replace(/-/g, ' '));

  let posts: Post[] = [];
  try {
    // Adapte sua função para buscar posts pela cidade (slug)
    const rawPosts = await fetchPostsForLocation(formattedCity, undefined, 12); // Assumindo que fetchPostsForLocation pode lidar com apenas a cidade
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
          Acompanhantes em {formattedCity}
        </h1>
        {/* Renderize a lista de acompanhantes aqui */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="rounded-lg shadow-md overflow-hidden flex flex-col bg-white">
                <Link href={`/perfil/${post.nome?.toLowerCase().replace(/\s+/g, '-') || 'anonimo'}`}>
                  <div className="relative w-full aspect-[9/16] cursor-pointer">
                    <Image
                      src={post.fileUrls[0] || "/placeholder.jpg"}
                      alt={`Foto de ${post.nome} em ${post.city}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      priority
                    />
                  </div>
                </Link>
                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">{post.nome}</h2>
                  <p className="text-sm text-gray-500">{post.city}</p>
                  <p className="text-sm text-gray-600 mb-2">{post.caption}</p>
                  <a
                    href={`https://wa.me/${post.whatsapp}?text=Olá! Encontrei você no seu site.`}
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
              Nenhum acompanhante encontrado em {formattedCity}.
            </p>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}