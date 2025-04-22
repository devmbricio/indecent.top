import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import Head from "next/head";

import { checkCreditsAndSubscription, getPostsFromProfileNoDeduction } from "@/actions/getInfluencerPosts";

import Posts from "@/components/Posts";
import MonitorCredits from "@/components/MonitorCredits";
import { PostsSkeleton } from "@/components/Skeletons";
import DistributeOnRouteLeave from "@/components/DistributeOnRouteLeave";

export default async function InfluencerPage({ params }: { params: { id: string } }) {
  console.log("[InfluencerPage] Rota /painel/posts/[id], params:", params);

  // Sessão do NextAuth => viewer
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  // viewerId = usuário logado | influencerId = criador do post
  const viewerId = session.user.id;
  const influencerId = params.id;

  try {
    console.log("[InfluencerPage] checkCreditsAndSubscription => viewerId =", viewerId);
    const { subscriptionLevel, credits, error, status } =
      await checkCreditsAndSubscription(viewerId);

    if (error || status === 403) {
      console.warn("[InfluencerPage] Redirecionando para /compras devido a erro ou acesso negado.");
      return {
        redirect: {
          destination: "/compras",
          permanent: false,
        },
      };
    }

    const userCredits = credits ?? 0; // Garante que userCredits seja sempre um número
    console.log("[InfluencerPage] subscriptionLevel =", subscriptionLevel, "credits =", userCredits);

    if (userCredits <= 0 && subscriptionLevel !== "free") {
      console.warn("[InfluencerPage] Redirecionando para /compras por falta de créditos.");
      return {
        redirect: {
          destination: "/compras",
          permanent: false,
        },
      };
    }

    // Buscar posts do influenciador SEM deduzir no server
    const profilePosts = await getPostsFromProfileNoDeduction(
      influencerId,
      subscriptionLevel as "free" | "basic" | "premium",
      userCredits
    );

    console.log("[InfluencerPage] getPostsFromProfileNoDeduction =>", profilePosts.length, "posts.");

    return (
      <>
        <Head>
          <title>Perfil - Posts</title>
          <meta name="description" content="Posts do influenciador" />
        </Head>

        <main className="flex flex-col items-center">
          {/* Mostrar créditos sempre */}
          <MonitorCredits
            userId={viewerId}
            credits={userCredits}
            influencerId={influencerId}
          />

          <div className="md:flex md:flex-col items-center w-full max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-4 ">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={profilePosts}
                subscriptionLevel={subscriptionLevel ?? "free"}
                userId={viewerId}
              />
            </Suspense>

            <DistributeOnRouteLeave
              viewerId={viewerId}
              influencerId={influencerId}
            />
          </div>
        </main>
      </>
    );
  } catch (err) {
    console.error("[InfluencerPage] Erro capturado:", err);
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.</p>
      </main>
    );
  }
}

/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import Head from "next/head";

import { checkCreditsAndSubscription, getPostsFromProfileNoDeduction } from "@/actions/getInfluencerPosts";

import Posts from "@/components/Posts";
import MonitorCredits from "@/components/MonitorCredits";
import { PostsSkeleton } from "@/components/Skeletons";
import DistributeOnRouteLeave from "@/components/DistributeOnRouteLeave";

export default async function InfluencerPage({ params }: { params: { id: string } }) {
  console.log("[InfluencerPage] Rota /painel/posts/[id], params:", params);

  // Sessão do NextAuth => viewer
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  // viewerId = usuário logado | influencerId = criador do post
  const viewerId = session.user.id;
  const influencerId = params.id;

  try {
    console.log("[InfluencerPage] checkCreditsAndSubscription => viewerId =", viewerId);
    const { subscriptionLevel, credits, error, status } =
      await checkCreditsAndSubscription(viewerId);

    if (error || status === 403) {
      console.warn("[InfluencerPage] Redirecionando para /compras devido a erro ou acesso negado.");
      return {
        redirect: {
          destination: "/compras",
          permanent: false,
        },
      };
    }

    const userCredits = credits ?? 0; // Garante que userCredits seja sempre um número
    console.log("[InfluencerPage] subscriptionLevel =", subscriptionLevel, "credits =", userCredits);

    if (userCredits <= 0 && subscriptionLevel !== "free") {
      console.warn("[InfluencerPage] Redirecionando para /compras por falta de créditos.");
      return {
        redirect: {
          destination: "/compras",
          permanent: false,
        },
      };
    }

    // Buscar posts do influenciador SEM deduzir no server
    const profilePosts = await getPostsFromProfileNoDeduction(
      influencerId,
      subscriptionLevel as "free" | "basic" | "premium",
      userCredits
    );

    console.log("[InfluencerPage] getPostsFromProfileNoDeduction =>", profilePosts.length, "posts.");

    return (
      <>
        <Head>
          <title>Perfil - Posts</title>
          <meta name="description" content="Posts do influenciador" />
        </Head>

        <main className="flex flex-col items-center">
          {subscriptionLevel !== "free" && userCredits > 0 && (
            <MonitorCredits
              userId={viewerId}
              credits={userCredits}
              influencerId={influencerId}
            />
          )}

          <div className="w-full max-w-3xl p-4">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={profilePosts}
                subscriptionLevel={subscriptionLevel ?? "free"}
                userId={viewerId}
              />
            </Suspense>

            <DistributeOnRouteLeave
              viewerId={viewerId}
              influencerId={influencerId}
            />
          </div>
        </main>
      </>
    );
  } catch (err) {
    console.error("[InfluencerPage] Erro capturado:", err);
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.</p>
      </main>
    );
  }
}
*/
/* funcional mas nao esta mostrando o monitor


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import Head from "next/head";

import { checkCreditsAndSubscription, getPostsFromProfileNoDeduction } from "@/actions/getInfluencerPosts";

import Posts from "@/components/Posts";
import { PostsSkeleton } from "@/components/Skeletons";
import DistributeOnRouteLeave from "@/components/DistributeOnRouteLeave";

export default async function InfluencerPage({ params }: { params: { id: string } }) {
  console.log("[InfluencerPage] Rota /painel/posts/[id], params:", params);

  // Sessão do NextAuth => viewer
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  // viewerId = usuário logado | influencerId = criador do post
  const viewerId = session.user.id;
  const influencerId = params.id;

  try {
    console.log("[InfluencerPage] checkCreditsAndSubscription => viewerId =", viewerId);
    const { subscriptionLevel, credits, error, status } =
      await checkCreditsAndSubscription(viewerId);

    if (error || status === 403) {
      console.warn("[InfluencerPage] Redirecionando para /compras devido a erro ou acesso negado.");
      return {
        redirect: {
          destination: "/compras",
          permanent: false,
        },
      };
    }

    const userCredits = credits ?? 0; // Garante que userCredits seja sempre um número
    console.log("[InfluencerPage] subscriptionLevel =", subscriptionLevel, "credits =", userCredits);

    if (userCredits <= 0 && subscriptionLevel !== "free") {
      console.warn("[InfluencerPage] Redirecionando para /compras por falta de créditos.");
      return {
        redirect: {
          destination: "/compras",
          permanent: false,
        },
      };
    }

    // Buscar posts do influenciador SEM deduzir no server
    const profilePosts = await getPostsFromProfileNoDeduction(
      influencerId,
      subscriptionLevel as "free" | "basic" | "premium",
      userCredits
    );

    console.log("[InfluencerPage] getPostsFromProfileNoDeduction =>", profilePosts.length, "posts.");

    return (
      <>
        <Head>
          <title>Perfil - Posts</title>
          <meta name="description" content="Posts do influenciador" />
        </Head>

        <main className="flex flex-col items-center">
          <div className="w-full max-w-3xl p-4">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={profilePosts}
                subscriptionLevel={subscriptionLevel ?? "free"}
                userId={viewerId}
              />
            </Suspense>

            <DistributeOnRouteLeave
              viewerId={viewerId}
              influencerId={influencerId}
            />
          </div>
        </main>
      </>
    );
  } catch (err) {
    console.error("[InfluencerPage] Erro capturado:", err);
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.</p>
      </main>
    );
  }
}
*/


/*
// app/painel/posts/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import Head from "next/head";

// Importa suas funções
import { checkCreditsAndSubscription, getPostsFromProfileNoDeduction } from "@/actions/getInfluencerPosts";

import MonitorCredits from "@/components/MonitorCredits";
import Posts from "@/components/Posts";
import { PostsSkeleton } from "@/components/Skeletons";
import DistributeOnRouteLeave from "@/components/DistributeOnRouteLeave";

export default async function InfluencerPage({ params }: { params: { id: string } }) {
  console.log("[InfluencerPage] Rota /painel/posts/[id], params:", params);

  // 1) Sessão do NextAuth => viewer
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  // 2) viewerId = user logado | influencerId = criador do post
  const viewerId = session.user.id;
  const influencerId = params.id;

  try {
    console.log("[InfluencerPage] checkCreditsAndSubscription => viewerId =", viewerId);
    const { subscriptionLevel, credits, error, status } =
      await checkCreditsAndSubscription(viewerId);

    if (error || status === 403) {
      return (
        <main className="flex items-center justify-center h-screen">
          <p>Você não possui permissão para acessar este conteúdo.</p>
        </main>
      );
    }

    const userCredits = credits ?? 0;
    console.log("[InfluencerPage] subscriptionLevel =", subscriptionLevel, "credits =", userCredits);

    // 3) Buscar posts do influenciador SEM deduzir no server
    // (Se é free e 0 créditos, só free. Caso contrário, todos.)
    const profilePosts = await getPostsFromProfileNoDeduction(
      influencerId,
      (subscriptionLevel as "free" | "basic" | "premium"),
      userCredits
    );

    console.log("[InfluencerPage] getPostsFromProfileNoDeduction =>", profilePosts.length, "posts.");

    // 4) Se não for free e tiver créditos => exibir MonitorCredits no client
    //    Ele chamará /api/monitor-credits e fará a distribuição em tempo real.
    const showMonitorCredits = subscriptionLevel !== "free" && userCredits > 0;

    return (
      <>
        <Head>
          <title>Perfil - Posts</title>
          <meta name="description" content="Posts do influenciador" />
        </Head>

        <main className="flex flex-col items-center">
          {showMonitorCredits && (
            <MonitorCredits
              userId={viewerId}   // ID do viewer (quem paga)
              credits={userCredits}
              influencerId={influencerId} // ID do influenciador (quem recebe)
            />
          )}

          <div className="w-full max-w-3xl p-4">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={profilePosts}
                subscriptionLevel={subscriptionLevel ?? "free"}
                userId={viewerId} // para likes, etc.
              />
            </Suspense>

 
            <DistributeOnRouteLeave
              viewerId={viewerId}
              influencerId={influencerId}
            />
          </div>
        </main>
      </>
    );
  } catch (err) {
    console.error("[InfluencerPage] Erro capturado:", err);
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.</p>
      </main>
    );
  }
}
*/


/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostsFromProfileWithCreditDeduction } from "@/actions/getInfluencerPosts";
import { getFilteredPosts } from "@/actions/getPosts";
import MonitorCredits from "@/components/MonitorCredits";
import Posts from "@/components/Posts";
import { PostsSkeleton } from "@/components/Skeletons";
import { Suspense } from "react";
import Head from "next/head";
import { checkCreditsAndSubscription } from "@/middlewares/deductCreditsMiddleware";


export default async function InfluencerPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Por favor, faça login para acessar o conteúdo.</p>
      </main>
    );
  }

  const viewerId = session.user.id; // ID do usuário visualizador
  const profileUserId = params.id; // ID do dono do perfil

  try {
    // Middleware para verificar assinatura e créditos
    const { subscriptionLevel = "free", credits, error, status } =
      await checkCreditsAndSubscription(viewerId);

    if (error && status !== 403) {
      return (
        <main className="flex items-center justify-center h-screen">
          <p>Ocorreu um erro. Tente novamente mais tarde.</p>
        </main>
      );
    }

    // Configura lógica para exibir conteúdo e monitorar créditos
    const userCredits = credits ?? 0;
    const showMonitorCredits = subscriptionLevel !== "free" && userCredits > 0;

    // Obtém os posts conforme o nível de assinatura
    const initialPosts = await getFilteredPosts(
      subscriptionLevel as "basic" | "premium" | "free",
      viewerId
    );

    // Buscar posts do perfil com dedução de créditos
    const profilePosts = await getPostsFromProfileWithCreditDeduction(profileUserId, viewerId);

    return (
      <>
        <Head>
          <title>Perfil - Posts</title>
          <meta name="description" content="Posts do perfil de usuário." />
        </Head>
        <main className="flex w-full flex-col">
          {showMonitorCredits && (
            <MonitorCredits userId={viewerId} credits={userCredits} />
          )}
          <div className="flex flex-col flex-1 gap-y-8 max-w-lg mx-auto pb-20">
            <Suspense fallback={<PostsSkeleton />}>
              <Posts
                initialPosts={profilePosts}
                subscriptionLevel={subscriptionLevel}
                userId={viewerId}
              />
            </Suspense>
          </div>
        </main>
      </>
    );
  } catch (error) {
    return (
      <main className="flex items-center justify-center h-screen">
   
      </main>
    );
  }
}
*/