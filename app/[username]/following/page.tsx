import FollowingModal from "@/components/FollowingModal";
import { fetchProfile } from "@/lib/data";

async function FollowingPage({
  params: { username },
}: {
  params: {
    username: string;
  };
}) {
  const profile = await fetchProfile(username);
  const following = profile?.following.map((follow) => ({
    ...follow,
    following: {
      ...follow.following, // Inclui as propriedades do usuário que está sendo seguido
      following: [],        // Adicione uma lista vazia de `following` (ou busque os dados, se necessário)
      followedBy: [],       // Adicione uma lista vazia de `followedBy` (ou busque os dados, se necessário)
    },
  }));

  return <FollowingModal following={following} username={username} />;
}

export default FollowingPage;


/*
import FollowingModal from "@/components/FollowingModal";
import { fetchProfile } from "@/lib/data";

async function FollowingPage({
  params: { username },
}: {
  params: {
    username: string;
  };
}) {
  const profile = await fetchProfile(username);
  const following = profile?.following;

  return <FollowingModal following={following} username={username} />;
}

export default FollowingPage;
*/