
import { redirect } from "next/navigation";
import { fetchProfile } from "@/lib/data";
import ProfileForm from "@/components/ProfileForm";

interface ProfilePageProps {
  params: { username: string };
}

export default async function EditProfilePage({
  params: { username },
}: ProfilePageProps) {
  const profile = await fetchProfile(username);

  if (!profile) {
    redirect("/404");
  }

  // Ajustar o tipo de verifiedProfile
  const verifiedProfile =
    profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED";

  // Garantir que 'followedBy' e 'following' estão no formato correto de UserWithFollows
  const profileWithExtras = {
    ...profile,
    followedBy: profile.followedBy?.map((follower) => ({
      ...follower,
      follower: {
        ...follower.follower, // Aqui você precisa garantir que a propriedade 'follower' tenha o tipo UserWithFollows
        following: [], // Garantir que as propriedades 'following' e 'followedBy' estejam presentes
        followedBy: [],
      },
    })) || [], // Adicionando uma lista vazia caso não exista
    following: profile.following?.map((following) => ({
      ...following,
      following: {
        ...following.following, // Aqui você precisa garantir que a propriedade 'following' tenha o tipo UserWithFollows
        following: [],
        followedBy: [],
      },
    })) || [],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-medium">Edit profile</h1>
      <ProfileForm profile={{ ...profileWithExtras, verifiedProfile }} />
    </div>
  );
}/*


import { redirect } from "next/navigation";
import { fetchProfile } from "@/lib/data";
import ProfileForm from "@/components/ProfileForm";

interface ProfilePageProps {
  params: { username: string };
}

export default async function EditProfilePage({
  params: { username },
}: ProfilePageProps) {
  const profile = await fetchProfile(username);

  if (!profile) {
    redirect("/404");
  }

  // Ajustar o tipo de verifiedProfile
  const verifiedProfile =
    profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED";

  // Garantir que 'followedBy' e 'following' estão no formato correto de UserWithFollows
  const profileWithExtras = {
    ...profile,
    followedBy: profile.followedBy?.map((follower) => ({
      ...follower,
      follower: {
        ...follower.follower, // Aqui você precisa garantir que a propriedade 'follower' tenha o tipo UserWithFollows
        following: [], // Garantir que as propriedades 'following' e 'followedBy' estejam presentes
        followedBy: [],
      },
    })) || [], // Adicionando uma lista vazia caso não exista
    following: profile.following?.map((following) => ({
      ...following,
      following: {
        ...following.following, // Aqui você precisa garantir que a propriedade 'following' tenha o tipo UserWithFollows
        following: [],
        followedBy: [],
      },
    })) || [],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-medium">Edit profile</h1>
      <ProfileForm profile={{ ...profileWithExtras }} />
    </div>
  );
}
*/

/*


import { redirect } from "next/navigation";
import { fetchProfile } from "@/lib/data";
import ProfileForm from "@/components/ProfileForm";

interface ProfilePageProps {
  params: { username: string };
}

export default async function EditProfilePage({
  params: { username },
}: ProfilePageProps) {
  const profile = await fetchProfile(username);

  if (!profile) {
    redirect("/404");
  }

  // Ajustar o tipo de verifiedProfile
  const verifiedProfile =
    profile.verifiedProfile === "VERIFIED" ? "VERIFIED" : "NOTVERIFIED";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-medium">Edit profile</h1>
      <ProfileForm profile={{ ...profile, verifiedProfile }} />
    </div>
  );
}
*/
