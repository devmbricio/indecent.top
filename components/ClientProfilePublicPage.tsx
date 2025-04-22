"use client"

import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import RedesSociaisGrid from "@/components/RedesSociaisGrid";
import StoryVideo from "./StoryVideo";

type ProfilePublicPageProps = {
  user: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOwnProfile: boolean;
    verifiedProfile: "VERIFIED" | "NOTVERIFIED";
    socials?: {
      indecent?: string;
      whatsapp?: string;
      instagram?: string;
      tiktok?: string;
      facebook?: string;
      pinterest?: string;
      twitter?: string;
      youtube?: string;
      onlyfans?: string;
      privacySocial?: string;
    };
    verificationPurchased: boolean;
  };
  userPosts: PostWithExtras[];
  userStories: { id: string; videoUrl: string; thumbnailUrl: string }[];
};

function ClientProfilePublicPage({
  user,
  userPosts,
  userStories,
}: ProfilePublicPageProps) {
  const [socials] = useState(user.socials || {});
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleStoryClick = (videoUrl: string) => {
    setSelectedStory(videoUrl);
    setModalVisible(true);
  };

  return (
    <div className="container md:w-[60%] w-[100%] md:mt-[0%] mt-1 md:p-4 p-1 z-10">
      {/* Primeira div com a imagem do usuário */}
      <div
          className="relative w-full aspect-[9/16]  rounded-md"
          style={{
            height: "1080px",  // Imagem ocupa no máximo 1080px
            backgroundImage: `url(${user.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 10, // Para garantir que a imagem esteja abaixo da segunda div
          }}
        >
        </div>

               {/* Segunda div com o gradiente sobreposto à imagem  
               <div
            className="absolute md:top-[50%] top-[50%]  left-0 w-full h-[100%] bg-gradient-to-b from-transparent to-black/10 rounded-md"
            style={{
              zIndex: 20, // Segunda div estará sobre a imagem
            }}
          ></div> */}

      <div className="relative z-30 md:mt-[-90%] mt-[-200%] lg:pr-8 lg:pl-8 pr-1 pl-1">
      <div className="relative flex justify-between items-center mb-4  bg-black/40 p-2 rounded-md">
        <div className="flex items-center ">
          <div className="w-16 h-16">
            <UserAvatar user={user} />
          </div>
          <div className="md:ml-4 ml-0">
            <h1 className="md:text-lg text-sm font-semibold text-[#ddc897]">{user.username}</h1>
            <p className="md:text-sm text-[12px] text-gray-600 font-semibold">@{user.username}</p>
          </div>
        </div>
        <div>
          {user.verifiedProfile === "VERIFIED" ? (
            <span className="text-green-500">✅ Perfil Verificado</span>
          ) : (
            <span className="text-red-500">❌ Não Verificado</span>
          )}
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="mb-4 text-gray-300  bg-black/40 p-2 rounded-md">
        <h2 className="text-md mb-4 p-0 rounded-sm font-semibold">Redes Sociais</h2>
        <RedesSociaisGrid socials={socials} username={user.username} />
      </div>

      {/* Stories */}
      <section className="mb-4  bg-black/40 p-2 rounded-md">
  <h2 className="text-md p-0 rounded-sm  mb-4 text-gray-300 font-semibold">Meus Stories</h2>
  {userStories.length > 0 ? (
    <div className="flex gap-4">
      {userStories.map((story) => (
        <div
          key={story.id}
          className="w-20 h-20 overflow-hidden cursor-pointer "
          onClick={() => handleStoryClick(story.videoUrl)} // Chamando a nova função
        >
          <Image
            src={story.thumbnailUrl || "/indecent-top-logo-rosa.png"}
            width={200}
            height={200}
            alt="Thumbnail"
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-600">Nenhum story encontrado.</p>
  )}

  {isModalVisible && selectedStory && (
    <StoriesModal
      onClose={() => setModalVisible(false)} // Fecha o modal sem problemas de delay
      videoUrl={selectedStory} // Garante que o vídeo seja carregado corretamente
    />
  )}
</section>


      {/* Posts */}
      <section className=" bg-black/40 p-2 rounded-md">
        <h2 className="text-md p-2 text-gray-300 font-semibold">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
    </div>
  );
}

export default ClientProfilePublicPage;

/* top austado funcional
"use client"
import {
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaPinterest,
  FaTwitter,
  FaYoutube,
  FaTelegram,
  FaLock,
} from "react-icons/fa";
import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import RedesSociaisGrid from "@/components/RedesSociaisGrid";

type ClientProfilePublicPageProps = {
  user: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOwnProfile: boolean;
    verifiedProfile: "VERIFIED" | "NOTVERIFIED";
    socials?: {
      indecent?: string;
      whatsapp?: string;
      instagram?: string;
      tiktok?: string;
      facebook?: string;
      pinterest?: string;
      twitter?: string;
      youtube?: string;
      onlyfans?: string;
      privacy?: string;
    };
    verificationPurchased: boolean;
  };
  userPosts: PostWithExtras[];
  userStories: { id: string; videoUrl: string; thumbnailUrl: string }[];
};

function ClientProfilePublicPage({
  user,
  userPosts,
  userStories,
}: ClientProfilePublicPageProps) {
  const [socials] = useState(user.socials || {});
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  return (
    <div className="container md:w-[60%] w-[90%] md:mt-[4%] mt-[8%] md:p-4 p-4">
      <div className="flex justify-between items-center mb-4 md:pt-[5%]  pt-[8%]">
        <div className="flex items-center">
          <div className="w-16 h-16">
            <UserAvatar user={user} />
          </div>
          <div className="md:ml-4 ml-0">
            <h1 className="md:text-lg text-sm text-[#ddc897]">{user.name}</h1>
            <p className="md:text-sm text-[12px] text-gray-600">@{user.username}</p>
          </div>
        </div>
        <div>
          {user.verifiedProfile === "VERIFIED" ? (
            <span className="text-green-500">✅ Perfil Verificado</span>
          ) : (
            <span className="text-red-500">❌ Não Verificado</span>
          )}
        </div>
      </div>
 
      <div className="shadow rounded-lg p-0 mb-6">
        <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
        <RedesSociaisGrid socials={socials} username={user.username} />
      </div>

 
      <section className="mb-6">
        <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
        {userStories.length > 0 ? (
          <div className="flex gap-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="w-20 h-20 overflow-hidden cursor-pointer"
                onClick={() => setSelectedStory(story.videoUrl)}
              >
                <Image
                  src={story.thumbnailUrl || "/indecent-top-logo.png"}
                  width={200}
                  height={200}
                  alt="Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum story encontrado.</p>
        )}
      </section>

      {selectedStory && (
        <StoriesModal
          onClose={() => setSelectedStory(null)}
          videoUrl={selectedStory}
        />
      )}

     
      <section>
        <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePublicPage;
*/
