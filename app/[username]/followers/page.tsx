import FollowersModal from "@/components/FollowersModal";
import { fetchProfile } from "@/lib/data";async function FollowersPage({


  params: { username },
}: {
  params: {
    username: string;
  };
}) {
  const profile = await fetchProfile(username);
  const followers = profile?.followedBy.map((follower) => ({
    ...follower,
    follower: {
      ...follower.follower, // Inclui as propriedades do usuário
      following: [],        // Adicione uma lista vazia de `following` (ou busque os dados, se necessário)
      followedBy: [],       // Adicione uma lista vazia de `followedBy` (ou busque os dados, se necessário)
    },
  }));

  return <FollowersModal followers={followers} username={username} />;
}

export default FollowersPage;
/*
import FollowersModal from "@/components/FollowersModal";
import { fetchProfile } from "@/lib/data";

async function FollowersPage({
  params: { username },
}: {
  params: {
    username: string;
  };
}) {
  const profile = await fetchProfile(username);
  const followers = profile?.followedBy;

  return <FollowersModal followers={followers} username={username} />;
}

export default FollowersPage;
*/