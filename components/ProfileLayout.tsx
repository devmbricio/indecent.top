import ProfileHeader from "@/components/ProfileHeader";
import ProfileAvatar from "@/components/ProfileAvatar";
import ProfileTabs from "@/components/ProfileTabs";
import { Button, buttonVariants } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";

interface ProfileLayoutProps {
  profile: any;
  isCurrentUser: boolean;
  children: React.ReactNode;
}

export default function ProfileLayout({ profile, isCurrentUser, children }: ProfileLayoutProps) {
  const isFollowing = profile.followedBy.some((user: any) => user.followerId === profile.id);

  return (
    <>
      <ProfileHeader username={profile.username} />
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-x-5 md:gap-x-10 px-4">
          <ProfileAvatar user={profile}>
            <UserAvatar
              user={profile}
              className="w-20 h-20 md:w-36 md:h-36 cursor-pointer"
            />
          </ProfileAvatar>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3">
              <p className="font-semibold text-xl">{profile.username}</p>
              {isCurrentUser ? (
                <>
                  <Link
                    href={`/painel/edit-profile`}
                    className={buttonVariants({
                      className: "!font-bold",
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Editar perfil
                  </Link>
                  <Button variant={"secondary"} className="font-bold" size={"sm"}>
                    Ver arquivos
                  </Button>
                </>
              ) : (
                <>
                  <FollowButton isFollowing={isFollowing} profileId={profile.id} />
                  <Button variant={"secondary"} className="font-bold" size={"sm"}>
                    Mensagem
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-x-7">
              <p className="font-medium">
                <strong>{profile.posts.length} posts</strong>
              </p>
              <Link
                href={`/painel/${profile.username}/followers`}
                className="font-medium"
              >
                <strong>{profile.followedBy.length}</strong> seguidores
              </Link>
              <Link
                href={`/painel/${profile.username}/following`}
                className="font-medium"
              >
                <strong>{profile.following.length}</strong> seguindo
              </Link>
            </div>
            <div className="text-sm">
              <div className="font-bold">{profile.name}</div>
              <p>{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>
      <ProfileTabs profile={profile} isCurrentUser={isCurrentUser} />
      {children}
    </>
  );
}
