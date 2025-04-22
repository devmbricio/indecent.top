import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  fetchPostsByUserId,
  fetchStoriesByUserId,
  fetchProfile,
  fetchUserSocials,
} from "@/lib/data";
import ClientProfilePublicPage from "@/components/ClientProfilePublicPage";

interface ProfilePublicPageProps {
  params: {
    username: string;
  };
}

// Função para gerar os metadados dinâmicos da página
export async function generateMetadata({ params: { username } }: ProfilePublicPageProps): Promise<Metadata> {
  try {
    const profile = await fetchProfile(username);
    if (!profile) throw new Error("Perfil não encontrado");

    return {
      title: `${profile.name || username} | indecent.top`,
      description: `Confira o perfil de ${profile.name || username} na indecent.top.`,
      openGraph: {
        title: `${profile.name || username} | indecent.top`,
        description: `Confira o perfil de ${profile.name || username} na indecent.top.`,
        images: [
          {
            url: profile.image || "/indecent-top-logo-transparent-9-16.png",
            width: 1200,
            height: 630,
            alt: profile.name || username,
          },
        ],
      },
      robots: "index, follow", // Permite indexação
    };
  } catch (error) {
    console.error("[SEO] Erro ao gerar metadata:", error);
    return {
      title: "Perfil não encontrado | indecent.top",
      description: "Este perfil não está disponível.",
      robots: "noindex, nofollow", // Evita indexação caso o perfil não exista
    };
  }
}

export default async function ProfilePublicPage({ params: { username } }: ProfilePublicPageProps) {
  console.log(`[ProfilePublicPage] Iniciando busca para o username: ${username}`);

  let profile;
  try {
    profile = await fetchProfile(username);
    if (!profile || !profile.id) throw new Error("Perfil não encontrado");
    console.log("[ProfilePublicPage] Perfil encontrado:", profile);
  } catch (error) {
    console.error(`[ProfilePublicPage] Erro ao buscar perfil para o username ${username}:`, error);
    return notFound();
  }

  console.log(`[ProfilePublicPage] Buscando posts e stories para o usuário ID: ${profile.id}`);

  const [userPosts, userStories] = await Promise.all([
    fetchPostsByUserId(profile.id).catch((error) => {
      console.error("[ProfilePublicPage] Erro ao buscar posts do usuário:", error);
      return [];
    }),
    fetchStoriesByUserId(profile.id, 5).catch((error) => {
      console.error("[ProfilePublicPage] Erro ao buscar stories do usuário:", error);
      return [];
    }),
  ]);

  console.log("[ProfilePublicPage] Posts encontrados:", userPosts);
  console.log("[ProfilePublicPage] Stories encontrados:", userStories);

  let socials = {};
  try {
    socials = await fetchUserSocials(profile.id);
    console.log("[ProfilePublicPage] Redes sociais encontradas:", socials);
  } catch (error) {
    console.error(
      `[ProfilePublicPage] Erro ao buscar redes sociais para o usuário ID ${profile.id}:`,
      error
    );
  }

  return (
    <ClientProfilePublicPage
      user={{
        id: profile.id,
        name: profile.name || "",
        username: profile.username || "",
        image: profile.image || "/indecent-top-logo-transparent-9-16.png",
        isOwnProfile: false,
        verifiedProfile: profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
        socials: socials || {},
        verificationPurchased: false,
      }}
      userPosts={userPosts || []}
      userStories={userStories || []}
    />
  );
}



/*
import { notFound } from "next/navigation";
import {
  fetchPostsByUserId,
  fetchStoriesByUserId,
  fetchProfile,
  fetchUserSocials,
} from "@/lib/data";
import ClientProfilePublicPage from "@/components/ClientProfilePublicPage";

interface ProfilePublicPageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePublicPage({ params: { username } }: ProfilePublicPageProps) {
  console.log(`[ProfilePublicPage] Iniciando busca para o username: ${username}`);

  let profile;

  try {
    // Buscar o perfil pelo username
    profile = await fetchProfile(username);
    console.log("[ProfilePublicPage] Perfil encontrado:", profile);
  } catch (error) {
    console.error(`[ProfilePublicPage] Erro ao buscar perfil para o username ${username}:`, error);
    notFound(); // Redirecionar para 404 se houver erro
  }

  if (!profile || !profile.id) {
    console.error(`[ProfilePublicPage] Perfil não encontrado para o username: ${username}`);
    notFound();
  }

  console.log(`[ProfilePublicPage] Buscando posts e stories para o usuário ID: ${profile.id}`);

  // Buscar posts e stories do usuário
  const [userPosts, userStories] = await Promise.all([
    fetchPostsByUserId(profile.id).catch((error) => {
      console.error("[ProfilePublicPage] Erro ao buscar posts do usuário:", error);
      return [];
    }),
    fetchStoriesByUserId(profile.id, 5).catch((error) => {
      console.error("[ProfilePublicPage] Erro ao buscar stories do usuário:", error);
      return [];
    }),
  ]);

  console.log("[ProfilePublicPage] Posts encontrados:", userPosts);
  console.log("[ProfilePublicPage] Stories encontrados:", userStories);

  // Buscar redes sociais do usuário
  let socials = {};
  try {
    socials = await fetchUserSocials(profile.id);
    console.log("[ProfilePublicPage] Redes sociais encontradas:", socials);
  } catch (error) {
    console.error(
      `[ProfilePublicPage] Erro ao buscar redes sociais para o usuário ID ${profile.id}:`,
      error
    );
  }

  // Retornar o componente com os dados carregados
  return (
    <ClientProfilePublicPage
      user={{
        id: profile.id,
        name: profile.name || "",
        username: profile.username || "",
        image: profile.image || "/indecent-top-logo-transparent-9-16.png",
        isOwnProfile: false, // Define como público
        verifiedProfile: profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
        socials: socials || {}, // Garante um objeto vazio se não houver dados
        verificationPurchased: false, // Não relevante para perfil público
      }}
      userPosts={userPosts || []} // Garante um array vazio se não houver posts
      userStories={userStories || []} // Garante um array vazio se não houver stories
    />
  );
}
*/



/*


import { notFound } from "next/navigation";
import { fetchPostsByUserId, fetchStoriesByUserId, fetchProfile } from "@/lib/data";
import ClientProfilePublicPage from "@/components/ClientProfilePublicPage";

interface ProfilePublicPageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePublicPage({ params: { username } }: ProfilePublicPageProps) {
  let profile;

  try {
    profile = await fetchProfile(username);
  } catch (error) {
    console.error(`Error fetching profile for username ${username}:`, error);
    notFound(); // Redireciona para a página de erro 404
  }

  // Valida se o perfil existe (defesa adicional)
  if (!profile || !profile.id) {
    notFound();
  }

  const userPosts = await fetchPostsByUserId(profile.id);
  const userStories = await fetchStoriesByUserId(profile.id, 5);

  // Normalizar `socials`
  const normalizeSocials = (socials: any) => {
    if (typeof socials === "string") {
      try {
        const parsed = JSON.parse(socials);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          return Object.fromEntries(
            Object.entries(parsed).map(([key, value]) => [
              key,
              value ?? undefined, // Converte null para undefined
            ])
          );
        }
      } catch {
        return {};
      }
    }
    return socials || {};
  };

  const socials = normalizeSocials(profile.socials);

  return (
    <ClientProfilePublicPage
      user={{
        id: profile.id,
        name: profile.name || "",
        username: profile.username || "",
        image: profile.image || "/indecent-top-logo-transparent-9-16.png",
        isOwnProfile: false, // Sempre false para impedir edição
        verifiedProfile: profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
        socials: socials,
        verificationPurchased: false, // Não relevante para perfil público
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}
*/

/*
import { fetchPostsByUserId, fetchStoriesByUserId, fetchProfile, fetchUserSocials } from "@/lib/data";
import ClientProfilePublicPage from "@/components/ClientProfilePublicPage";

interface ProfilePublicPageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePublicPage({ params: { username } }: ProfilePublicPageProps) {
  const profile = await fetchProfile(username);

  // Validação para verificar se o perfil é válido
  if (!profile || 'error' in profile || !profile.id) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-2xl font-bold">Perfil não encontrado</h1>
        <p>Por favor, verifique o nome de usuário ou tente novamente mais tarde.</p>
      </div>
    );
  }

  const userPosts = await fetchPostsByUserId(profile.id);
  const userStories = await fetchStoriesByUserId(profile.id, 5);
  const socials = await fetchUserSocials(profile.id); // Buscar redes sociais separadamente

  return (
    <ClientProfilePublicPage
      user={{
        id: profile.id,
        name: profile.name || "",
        username: profile.username || "",
        image: profile.image || "/indecent-top-logo.png",
        isOwnProfile: false, // Sempre false para impedir edição
        verifiedProfile: profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
        socials: socials,
        verificationPurchased: false,
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}
*/
