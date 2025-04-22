import { getPostsByTag } from "@/actions/getPostsByTag";
import Posts from "@/components/Posts";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";

export async function generateMetadata({
  params,
}: {
  params: { sort: "views" | "recent" | "popular"; tag: string }; // Define os valores permitidos para "sort"
}) {
  const { sort, tag } = params;

  const titles = {
    views: "Mais Visualizados",
    recent: "Mais Recentes",
    popular: "Mais Populares",
  };

  return {
    title: `Explore ${titles[sort]} com a Tag "${tag}" - Indecent.top`,
    description: `Descubra os posts ${titles[sort].toLowerCase()} relacionados à tag "${tag}" na plataforma Indecent.top. Conecte-se com criadores, ganhe com $indecent, e aproveite conteúdos exclusivos.`,
    keywords: [tag, sort, "conteúdo adulto", "plataforma de criadores", "$indecent"],
    openGraph: {
      title: `Explore ${titles[sort]} com a Tag "${tag}"`,
      description: `Veja os posts ${titles[sort].toLowerCase()} com a tag "${tag}" e aproveite conteúdos exclusivos.`,
      images: [
        {
          url: `/static/tags/${tag}-banner.jpg`, // Atualize conforme necessário
          alt: `Explore ${tag}`,
        },
      ],
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: { sort: "views" | "recent" | "popular"; tag: string }; // Define os valores permitidos para "sort"
}) {
  const { sort, tag } = params;

  const subscriptionLevel = "free"; // Substitua com lógica real
  const userId = "user-id-placeholder"; // Substitua com lógica real

  // Busca os posts com base na tag e ordenação
  const initialPosts = await getPostsByTag(tag, sort);

  return (
    <main className="flex w-full flex-col col-2">
      <div className="flex flex-col flex-1 gap-y-8 max-w-l mx-auto pb-20">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts
            initialPosts={initialPosts}
            subscriptionLevel={subscriptionLevel}
            userId={userId}
          />
        </Suspense>
      </div>
    </main>
  );
}


/*
import { getPostsByTag } from "@/actions/getPostsByTag";
import Posts from "@/components/Posts";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";

export default async function TagPage({
  
  params,
}: {
  params: { sort: string; tag: string };
}) {
  const { sort, tag } = params;

  // Substitua por valores reais
  const subscriptionLevel = "free"; // Substitua com lógica real
  const userId = "user-id-placeholder"; // Substitua com lógica real

  // Busca os posts com base na tag e ordenação
  const initialPosts = await getPostsByTag(tag, sort);

  return (
    <main className="flex w-full flex-col col-2">
      <div className="flex flex-col flex-1 gap-y-8 max-w-l mx-auto pb-20">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts
            initialPosts={initialPosts}
            subscriptionLevel={subscriptionLevel}
            userId={userId}
          />
        </Suspense>
      </div>
    </main>
  );
}
*/