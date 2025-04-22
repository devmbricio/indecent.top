import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Posts from "@/components/Posts";
import { getFilteredPosts } from "@/actions/getPosts";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Head from "next/head";
import { fetchUserCredits } from "@/lib/data";
import prisma from "@/lib/prisma";
import SetReferral from "@/lib/SetReferral";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  const userId = session.user.id;
  const subscriptionLevel = session.user.subscriptionLevel ?? "free";

  try {
    // Captura o `referralId` da URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const referralId = urlParams.get("ref");

      if (referralId) {
        // Verifica se o campo `referredById` já está definido
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { referredById: true },
        });

        if (!user?.referredById) {
          // Atualiza o `referredById` apenas se ainda não estiver definido
          await prisma.user.update({
            where: { id: userId },
            data: { referredById: referralId },
          });
        }
      }
    }

    // Busca os créditos do usuário
    const credits = await fetchUserCredits(userId);

    // Carrega os posts filtrados
    const initialPosts = await getFilteredPosts(subscriptionLevel, userId);

    return (
      <>
        
          <title>Indecent.top Life Style</title>
          <meta
            name="description"
            content="Explore os melhores posts de conteúdo adulto disponíveis para você!"
          />
          <meta name="keywords" content="posts, fotos, vídeos, livecam" />
          <link rel="canonical" href="https://indecent.top" />
          <meta property="og:title" content="Conteúdo Adulto" />
          <meta
            property="og:description"
            content="Explore os melhores posts de conteúdo adulto disponíveis para você!"
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/path/to/og-image.jpg" />
          <meta property="og:url" content="https://indecent.top" />
        
        <main className="flex flex-col items-center w-full overflow-hidden px-2 md:px-4">
        <SetReferral />
          <div className="bg-gray-600 p-1 rounded-md mb-1 text-center">
            <p className="text-gray-300 font-semibold">Créditos: {credits}</p>
          </div>

          <div className="md:flex md:flex-col items-center w-full max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-2">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={initialPosts}
                subscriptionLevel={subscriptionLevel}
                userId={userId}
              />
            </Suspense>
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error("[HomePage] Erro ao carregar a página:", error);
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Ocorreu um erro ao carregar o conteúdo. Tente novamente mais tarde.</p>
      </main>
    );
  }
}

/* antes da revisao do layout 
import { getServerSession } from "next-auth";zzz
import { authOptions } from "@/lib/auth";
import Posts from "@/components/Posts";
import { getFilteredPosts } from "@/actions/getPosts";
import { Suspense } from "react";
import { PostsSkeleton } from "@/components/Skeletons";
import Head from "next/head";
import { fetchUserCredits } from "@/lib/data";
import prisma from "@/lib/prisma";
import SetReferral from "@/lib/SetReferral";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  const userId = session.user.id;
  const subscriptionLevel = session.user.subscriptionLevel ?? "free";

  try {
    // Captura o `referralId` da URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const referralId = urlParams.get("ref");

      if (referralId) {
        // Verifica se o campo `referredById` já está definido
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { referredById: true },
        });

        if (!user?.referredById) {
          // Atualiza o `referredById` apenas se ainda não estiver definido
          await prisma.user.update({
            where: { id: userId },
            data: { referredById: referralId },
          });
        }
      }
    }

    // Busca os créditos do usuário
    const credits = await fetchUserCredits(userId);

    // Carrega os posts filtrados
    const initialPosts = await getFilteredPosts(subscriptionLevel, userId);

    return (
      <>
        <Head>
          <title>Indecent.top Life Style</title>
          <meta
            name="description"
            content="Explore os melhores posts de conteúdo adulto disponíveis para você!"
          />
          <meta name="keywords" content="posts, fotos, vídeos, livecam" />
          <link rel="canonical" href="https://indecent.top" />
          <meta property="og:title" content="Conteúdo Adulto" />
          <meta
            property="og:description"
            content="Explore os melhores posts de conteúdo adulto disponíveis para você!"
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/path/to/og-image.jpg" />
          <meta property="og:url" content="https://indecent.top" />
        </Head>
        <main className="flex flex-col items-center mx-auto overflow-hidden">
        <SetReferral />
          <div className="bg-gray-600 p-1 rounded-md mb-1 text-center">
            <p className="text-gray-300 font-semibold">Créditos: {credits}</p>
          </div>

          <div className="flex flex-col flex-1 gap-y-8 lg:max-w-md max-w-xl mx-auto pb-20 pr-1 pl-1 overflow-hidden">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={initialPosts}
                subscriptionLevel={subscriptionLevel}
                userId={userId}
              />
            </Suspense>
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error("[HomePage] Erro ao carregar a página:", error);
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Ocorreu um erro ao carregar o conteúdo. Tente novamente mais tarde.</p>
      </main>
    );
  }
}
*/
