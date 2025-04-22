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

