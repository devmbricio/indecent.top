import { redirect } from "next/navigation"; 
import { fetchPostsByUserId, fetchStoriesByUserId, fetchUserSocials, fetchUserCredits } from "@/lib/data"; 
import { getCurrentUser } from "@/lib/session"; 
import ClientProfilePage from "@/components/ClientProfilePage"; 

export default async function PerfilPage() { 
  const user = await getCurrentUser();

  if (!user) { 
    redirect("/login"); 
  }

  const userPosts = await fetchPostsByUserId(user.id);

  if (!userPosts || userPosts.length === 0) { 
    redirect("/404"); 
  }

  // Buscar redes sociais e garantir que sejam normalizadas
  const socials = await fetchUserSocials(user.id);
  
  // Buscar créditos de afiliados
  const credits = await fetchUserCredits(user.id); 

  const verificationPurchased = Boolean(user.verificationPurchased);

  const userStories = await fetchStoriesByUserId(user.id, 5);

  // Envio do job diretamente do banco
  const job = user.job;  // Não há necessidade de transformar, já estará como 'JOB' ou 'USER'

  return (
    <ClientProfilePage
      user={{
        id: user.id,
        name: user.name || "",
        username: user.username || "",
        image: user.image || "/indecent-top-logo-transparent-9-16.png",
        isOwnProfile: true,
        verifiedProfile: user.verifiedProfile || "NOTVERIFIED",
        socials, // Redes sociais normalizadas
        verificationPurchased,
        job,  // Passando o job diretamente do banco
        credits: credits || 0, // Certifique-se de passar credits aqui
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}


/* funcional antes dos creditos



import { redirect } from "next/navigation"; 
import { fetchPostsByUserId, fetchStoriesByUserId, fetchUserSocials } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import ClientProfilePage from "@/components/ClientProfilePage";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPosts = await fetchPostsByUserId(user.id);

  if (!userPosts || userPosts.length === 0) {
    redirect("/404");
  }

  // Buscar redes sociais e garantir que sejam normalizadas
  const socials = await fetchUserSocials(user.id);

  const verificationPurchased = Boolean(user.verificationPurchased);

  const userStories = await fetchStoriesByUserId(user.id, 5);

  // Garantir que `job` seja do tipo "USER" ou "JOB"
  const job = user.job === "JOB" ? "JOB" : "USER";

  return (
    <ClientProfilePage
      user={{
        id: user.id,
        name: user.name || "",
        username: user.username || "",
        image: user.image || "/indecent-top-logo-transparent-9-16.png",
        isOwnProfile: true,
        verifiedProfile: user.verifiedProfile || "NOTVERIFIED",
        socials, // Redes sociais normalizadas
        verificationPurchased,
        job,
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}
*/

/* 
import { redirect } from "next/navigation";
import { fetchPostsByUserId, fetchStoriesByUserId } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import ClientProfilePage from "@/components/ClientProfilePage";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPosts = await fetchPostsByUserId(user.id);

  if (!userPosts || userPosts.length === 0) {
    redirect("/404");
  }

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

  const socials = normalizeSocials(user.socials);

  const verificationPurchased = Boolean(user.verificationPurchased);

  // Fetch últimos 5 stories
  const userStories = await fetchStoriesByUserId(user.id, 5);

  return (
    <ClientProfilePage
      user={{
        id: user.id,
        name: user.name || "",
        username: user.username || "",
        image: user.image || "/indecent-top-logo.png",
        isOwnProfile: true,
        verifiedProfile: user.verifiedProfile || "NOTVERIFIED",
        socials: socials,
        verificationPurchased,
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}
*/
/*import { redirect } from "next/navigation";
import { fetchPostsByUserId, fetchStoriesByUserId } from "@/lib/data";
import { getCurrentUser } from "@/lib/session";
import ClientProfilePage from "@/components/ClientProfilePage";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userPosts = await fetchPostsByUserId(user.id);

  if (!userPosts || userPosts.length === 0) {
    redirect("/404");
  }

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

  const socials = normalizeSocials(user.socials);

  const verificationPurchased = Boolean(user.verificationPurchased);

  // Fetch últimos 5 stories
  const userStories = await fetchStoriesByUserId(user.id, 5);

  return (
    <ClientProfilePage
      user={{
        id: user.id,
        name: user.name || "",
        username: user.username || "",
        image: user.image || "/indecent-top-logo.png",
        isOwnProfile: true,
        verifiedProfile: user.verifiedProfile || "NOTVERIFIED",
        socials: socials,
        verificationPurchased,
      }}
      userPosts={userPosts}
      userStories={userStories}
    />
  );
}
*/
