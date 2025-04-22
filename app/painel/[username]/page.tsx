import { redirect } from "next/navigation";
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
        image: profile.image || "/indecent.top_logo_9-16.png",
        isOwnProfile: false, // Sempre false para impedir edição
        verifiedProfile: profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED",
        socials, // Redes sociais processadas
        verificationPurchased: false,
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}
