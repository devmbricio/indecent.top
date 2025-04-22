"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";
import SocialsForm from "./forms/SocialsForm";
import AffiliateCredits from "@/components/AffiliateCredits";

type ProfilePageProps = {
  user: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOwnProfile: boolean;
    verifiedProfile: "VERIFIED" | "NOTVERIFIED";
    socials?: Record<string, string | undefined>; // Redes sociais normalizadas
    verificationPurchased: boolean;
    job: "JOB" | "USER"; // Novo campo de "job" que pode ser "JOB" ou "USER"
   credits?: number | null; // Agora estamos incluindo "credits"
  };
  userPosts: PostWithExtras[];
  userStories: { id: string; videoUrl: string; thumbnailUrl: string }[];
};

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ProfilePageProps) {
  const [verifiedProfile, setVerifiedProfile] = useState(user.verifiedProfile || "NOTVERIFIED");
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [job, setJob] = useState<"JOB" | "USER">(user.job);

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Primeiro, faz o upload para o S3
      const uploadResponse = await axios.post("/api/upload-avatar/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const { fileUrl } = uploadResponse.data; // Recebe a URL do arquivo

        // Agora, envia a URL para salvar no banco de dados
        const saveResponse = await axios.post("/api/upload-avatar/save", {
          userId: user.id,
          imageUrl: fileUrl,
        });

        if (saveResponse.status === 200) {
          alert("Avatar atualizado com sucesso!");
          window.location.reload(); // Recarregar a página para refletir o novo avatar
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  const handleJobChange = async (newJob: "JOB" | "USER") => {
    try {
      const response = await axios.post("/api/update-job", {
        userId: user.id,
        job: newJob, // Agora passando o valor do enum
      });

      if (response.status === 200) {
        setJob(newJob); // Atualiza o estado local
        alert("Job atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar job:", error);
      alert("Erro ao atualizar job.");
    }
  };

  useEffect(() => {
    // Atualiza o estado inicial com o valor do backend
    setJob(user.job);
  }, [user.job]);
  
  console.log("Estado atual do job no estado do componente:", job); // Verificando o valor atual do estado 'job'

  return (
    <div className="flex justify-center items-center min-h-screen bg-black/1">
      <div className="w-full max-w-xl pt-0 md:text-lg text-[12px]">
        {/* Primeira div com a imagem do usuário */}
        <div
          className="relative w-full opacity-30"
          style={{
            height: "1080px", // Imagem ocupa no máximo 1080px
            backgroundImage: `url(${user.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 10, // Para garantir que a imagem esteja abaixo da segunda div
          }}
        >
        </div>

        {/* Segunda div com o gradiente sobreposto à imagem */}
        <div
          className="absolute md:top-[50%] top-[50%] left-0 w-full h-[50%] bg-gradient-to-b from-transparent to-[#808080]"
          style={{
            zIndex: 20, // Segunda div estará sobre a imagem
          }}
        ></div>

        {/* Conteúdo sobreposto, começando da metade da imagem */}
        <div className="relative z-30 pr-8 pl-8 pt-8 lg:mt-[-190%] md:mt-[-240%] mt-[-255%] bg-black/10 opacity-80 rounded-md">


        <div className="text-muted-foreground bg-black opacity-75 md:p-2 rounded-md text-gray-300 font-semibold placeholder-gray-400 ">
          <div className="flex justify-between items-center md:pt-[0%] pt-[5%] z-20">
            <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2 ml-2">@{user.username}</h1>
            {verifiedProfile === "VERIFIED" ? (
              <span className="text-green-500">Perfil Verificado ✅</span>
            ) : (
              user.isOwnProfile && (
                <button
                  onClick={handleRequestVerification}
                  className="md:ml-4 ml-1 bg-gray-600 text-gray-300 font-semibold hover:bg-green-400 md:px-2 px-1 py-1 rounded"
                >
                  {user.verificationPurchased ? "Solicitar Verificação" : "Verificar Perfil"}
                </button>
              )
            )}0


          {/* Exibe o Job como "JOB" ou "USER" com um botão de alternância */}
          {user.isOwnProfile && (
            <div className="pl-1 flex items-center space-x-2">
              {/* Toggle Switch */}
              <label className="inline-flex items-center cursor-pointer">
        <span className="mr-2 text-gray-300 ">Job?</span>
        <div className="relative">
        <input
            type="checkbox"
            checked={job === "JOB"}
            onChange={() => handleJobChange(job === "USER" ? "JOB" : "USER")}
            className="sr-only"
          />
          <div className="block bg-gray-400 w-12 h-5 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${
              job === "JOB" ? "transform translate-x-6" : ""
            }`}
          ></div>
        </div>
      </label>



 {/* Mostra visualmente o estado atual */}
 <span className={job === "JOB" ? "text-green-500" : "text-red-500"}>
        {job === "JOB" ? "SIM" : "NÃO"}
      </span>
  </div>
)}

          </div>


          

          <div className="flex items-center mt-2 md:mb-0 mb-0">
            <div className="w-18 h-18 mt-0">
              <UserAvatar user={user} />
            </div>
            {user.isOwnProfile && (
              <div className="ml-2 rounded-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUpdateAvatar(e.target.files[0]);
                    }
                  }}
                  className="mt-0 bg-gray-600 text-gray-300 placeholder-gray-400 rounded-md"
                />
              </div>
            )}
          </div>

                 {/*creditos por afiliado*/}
       {user.isOwnProfile && (
            <div className="shadow rounded-lg p-2 mb-0 ">
              <h2 className="text-md mb-2 p-0 rounded-sm placeholder-gray-400">Carteira</h2>
              <AffiliateCredits userId={user.id} />
            </div>
          )}

</div>

          
          {user.isOwnProfile && (
            <div className="shadow rounded-lg p-0 mb-6">
              <h2 className="text-md mb-2 p-0 rounded-md text-gray-300 font-semibold placeholder-gray-400  ">Atualizar Informações</h2>
              <UpdateUserNameForm
                userId={user.id}
                initialName={user.username || ""}
                initialUsername={user.username || ""}
              />
            </div>
          )}

          <div className="shadow rounded-lg p-0 mb-2">
            <h2 className="text-md mb-2 p-0 rounded-sm text-gray-300 font-semibold ">Redes Sociais</h2>
            {user.isOwnProfile && (
              <SocialsForm
                initialSocials={{
                  indecent: user.socials?.indecent || "",
                  whatsapp: user.socials?.whatsapp || "",
                  instagram: user.socials?.instagram || "",
                  tiktok: user.socials?.tiktok || "",
                  facebook: user.socials?.facebook || "",
                  pinterest: user.socials?.pinterest || "",
                  twitter: user.socials?.twitter || "",
                  youtube: user.socials?.youtube || "",
                  onlyfans: user.socials?.onlyfans || "",
                  privacySocial: user.socials?.privacySocial || "",
                }}
                userId={user.id}
              />
            )}
          </div>

          <section className="mb-6">
            <h2 className="text-md pt-4 rounded-sm text-gray-300 font-semibold mb-4">Meus Stories</h2>
            {userStories.length > 0 ? (
              <div className="flex gap-4">
                {userStories.map((story) => (
                  <div
                    key={story.id}
                    className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
                    onClick={() => setSelectedStory(story.videoUrl)}
                  >
                    <Image
                      src={story.thumbnailUrl || "/indecent-top-logo-rosa.png"}
                      width={150}
                      height={150}
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
            <StoriesModal onClose={() => setSelectedStory(null)} videoUrl={selectedStory} />
          )}

          <section>
            <h2 className="text-md  mb-4 pt-4 rounded-sm text-gray-300 font-semibold">Meus Posts</h2>
            {userPosts && userPosts.length > 0 ? (
              <PostsGrid posts={userPosts} />
            ) : (
              <p>Nenhum post encontrado.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ClientProfilePage;



/* funcional imagem de bg no profile


"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";
import SocialsForm from "./forms/SocialsForm";

type ProfilePageProps = {
  user: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOwnProfile: boolean;
    verifiedProfile: "VERIFIED" | "NOTVERIFIED";
    socials?: Record<string, string | undefined>; // Redes sociais normalizadas
    verificationPurchased: boolean;
  };
  userPosts: PostWithExtras[];
  userStories: { id: string; videoUrl: string; thumbnailUrl: string }[];
};

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ProfilePageProps) {
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      // Primeiro, faz o upload para o S3
      const uploadResponse = await axios.post("/api/upload-avatar/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (uploadResponse.status === 200) {
        const { fileUrl } = uploadResponse.data;  // Recebe a URL do arquivo
  
        // Agora, envia a URL para salvar no banco de dados
        const saveResponse = await axios.post("/api/upload-avatar/save", {
          userId: user.id,
          imageUrl: fileUrl,
        });
  
        if (saveResponse.status === 200) {
          alert("Avatar atualizado com sucesso!");
          window.location.reload();  // Recarregar a página para refletir o novo avatar
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black/1">
      <div className="w-full max-w-xl md:w-[60%] pt-0 md:text-lg text-[12px]">
 
        <div
          className="relative w-full"
          style={{
            height: "1080px",  // Imagem ocupa no máximo 1080px
            backgroundImage: `url(${user.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 10, // Para garantir que a imagem esteja abaixo da segunda div
          }}
        >
        </div>
 
         <div
            className="absolute md:top-[75%] top-[75%]  left-0 w-full h-[50%] bg-gradient-to-b from-transparent to-[#808080]"
            style={{
              zIndex: 20, // Segunda div estará sobre a imagem
            }}
          ></div>
 
        <div className="relative z-30 pr-8 pl-8 mt-[-170%]">
          <div className="flex justify-between items-center md:pt-[50%] pt-[50%] z-20">
            <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2">{user.name}</h1>
            {verifiedProfile === "VERIFIED" ? (
              <span className="text-green-500">Perfil Verificado ✅</span>
            ) : (
              user.isOwnProfile && (
                <button
                  onClick={handleRequestVerification}
                  className="md:ml-4 ml-1 bg-[#e8d3e8ff] text-gray-300 hover:bg-gray-600 md:px-2 px-1 py-1 rounded"
                >
                  {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
                </button>
              )
            )}
          </div>

          <div className="flex items-center md:mb-4 mb-2">
            <div className="w-16 h-16">
              <UserAvatar user={user} />
            </div>
            {user.isOwnProfile && (
              <div className="ml-4 rounded-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUpdateAvatar(e.target.files[0]);
                    }
                  }}
                  className="mt-2 bg-gray-600 text-gray-300 placeholder-gray-400 rounded-md"
                />
              </div>
            )}
          </div>

          {user.isOwnProfile && (
            <div className="shadow rounded-lg p-0 mb-6">
              <h2 className="text-md mb-2 p-2 rounded-sm bg-[#e8d3e8ff]"></h2>
              <UpdateUserNameForm
                userId={user.id}
                initialName={user.name || ""}
                initialUsername={user.username || ""}
              />
            </div>
          )}

          <div className="shadow rounded-lg p-0 mb-6">
            <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
            {user.isOwnProfile && (
              <SocialsForm
                initialSocials={{
                  indecent: user.socials?.indecent || "",
                  whatsapp: user.socials?.whatsapp || "",
                  instagram: user.socials?.instagram || "",
                  tiktok: user.socials?.tiktok || "",
                  facebook: user.socials?.facebook || "",
                  pinterest: user.socials?.pinterest || "",
                  twitter: user.socials?.twitter || "",
                  youtube: user.socials?.youtube || "",
                  onlyfans: user.socials?.onlyfans || "",
                  privacySocial: user.socials?.privacySocial || "",
                }}
                userId={user.id}
              />
            )}
          </div>

          <section className="mb-6">
            <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
            {userStories.length > 0 ? (
              <div className="flex gap-4">
                {userStories.map((story) => (
                  <div
                    key={story.id}
                    className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
                    onClick={() => setSelectedStory(story.videoUrl)}
                  >
                    <Image
                      src={story.thumbnailUrl || "/indecent-top-logo.png"}
                      width={150}
                      height={150}
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
            <StoriesModal onClose={() => setSelectedStory(null)} videoUrl={selectedStory} />
          )}

          <section>
            <h2 className="text-md bg-[black/10] mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
            {userPosts && userPosts.length > 0 ? (
              <PostsGrid posts={userPosts} />
            ) : (
              <p>Nenhum post encontrado.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ClientProfilePage;
*/

/* 100% antes da imagen de bg do profile
"use client";

import { useState } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";
import SocialsForm from "./forms/SocialsForm";

type ProfilePageProps = {
  user: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOwnProfile: boolean;
    verifiedProfile: "VERIFIED" | "NOTVERIFIED";
    socials?: Record<string, string | undefined>; // Redes sociais normalizadas
    verificationPurchased: boolean;
  };
  userPosts: PostWithExtras[];
  userStories: { id: string; videoUrl: string; thumbnailUrl: string }[];
};

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ProfilePageProps) {
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      // Primeiro, faz o upload para o S3
      const uploadResponse = await axios.post("/api/upload-avatar/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (uploadResponse.status === 200) {
        const { fileUrl } = uploadResponse.data;  // Recebe a URL do arquivo
  
        // Agora, envia a URL para salvar no banco de dados
        const saveResponse = await axios.post("/api/upload-avatar/save", {
          userId: user.id,
          imageUrl: fileUrl,
        });
  
        if (saveResponse.status === 200) {
          alert("Avatar atualizado com sucesso!");
          window.location.reload();  // Recarregar a página para refletir o novo avatar
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };
  

  return (
    <div className="container md:w-[60%] w-full pt-4 md:text-lg text-[12px]"
    style={{
      backgroundImage: `url(${user.image})`, // Definir imagem de fundo usando o link de imagem do usuário
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', // Para garantir que o background ocupe a tela inteira
    }}
    >
      
      <div className="flex justify-between items-center md:pt-[5%] pt-[8%]">
        <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2">{user.name}</h1>
        {verifiedProfile === "VERIFIED" ? (
          <span className="text-green-500">Perfil Verificado ✅</span>
        ) : (
          user.isOwnProfile && (
            <button
              onClick={handleRequestVerification}
              className="md:ml-4 ml-1 bg-[#e8d3e8ff] text-gray-300 hover:bg-gray-600 md:px-2 px-1 py-1 rounded"
            >
              {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
            </button>
          )
        )}
      </div>

      <div className="flex items-center md:mb-4 mb-2">
        <div className="w-16 h-16">
          <UserAvatar user={user} />
        </div>
        {user.isOwnProfile && (
          <div className="ml-4 rounded-md">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpdateAvatar(e.target.files[0]);
                }
              }}
              className="mt-2 bg-gray-600 text-gray-300 placeholder-gray-400 rounded-md"
            />
          </div>
        )}
      </div>

      {user.isOwnProfile && (
        <div className="shadow rounded-lg p-0 mb-6">
          <h2 className="text-md mb-2 p-2 rounded-sm bg-[#e8d3e8ff]">Atualizar Informações</h2>
          <UpdateUserNameForm
            userId={user.id}
            initialName={user.name || ""}
            initialUsername={user.username || ""}
          />
        </div>
      )}

  
      <div className="shadow rounded-lg p-0 mb-6">
        <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
        {user.isOwnProfile && (
          <SocialsForm
            initialSocials={{
              indecent: user.socials?.indecent || "",
              whatsapp: user.socials?.whatsapp || "",
              instagram: user.socials?.instagram || "",
              tiktok: user.socials?.tiktok || "",
              facebook: user.socials?.facebook || "",
              pinterest: user.socials?.pinterest || "",
              twitter: user.socials?.twitter || "",
              youtube: user.socials?.youtube || "",
              onlyfans: user.socials?.onlyfans || "",
              privacySocial: user.socials?.privacySocial || "",
            }}
            userId={user.id}
          />
        )}
      </div>


      <section className="mb-6">
        <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
        {userStories.length > 0 ? (
          <div className="flex gap-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
                onClick={() => setSelectedStory(story.videoUrl)}
              >
                <Image
                  src={story.thumbnailUrl || "/indecent-top-logo.png"}
                  width={150}
                  height={150}
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
        <StoriesModal onClose={() => setSelectedStory(null)} videoUrl={selectedStory} />
      )}


      <section>
        <h2 className="text-md bg-[black/10] mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
*/


/* funcional antes da atualizacao avatar s3
"use client";

import { useState } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";
import SocialsForm from "./forms/SocialsForm";

type ProfilePageProps = {
  user: {
    id: string;
    name: string;
    username: string;
    image: string;
    isOwnProfile: boolean;
    verifiedProfile: "VERIFIED" | "NOTVERIFIED";
    socials?: Record<string, string | undefined>; // Redes sociais normalizadas
    verificationPurchased: boolean;
  };
  userPosts: PostWithExtras[];
  userStories: { id: string; videoUrl: string; thumbnailUrl: string }[];
};

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ProfilePageProps) {
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post("/api/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        alert("Avatar atualizado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  return (
    <div className="container md:w-[60%] w-full pt-4 md:text-lg text-[12px]">
      <div className="flex justify-between items-center md:pt-[5%] pt-[8%]">
        <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2">{user.name}</h1>
        {verifiedProfile === "VERIFIED" ? (
          <span className="text-green-500">Perfil Verificado ✅</span>
        ) : (
          user.isOwnProfile && (
            <button
              onClick={handleRequestVerification}
              className="md:ml-4 ml-1 bg-[#e8d3e8ff] text-gray-300 hover:bg-gray-600 md:px-2 px-1 py-1 rounded"
            >
              {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
            </button>
          )
        )}
      </div>

      <div className="flex items-center md:mb-4 mb-2">
        <div className="w-16 h-16">
          <UserAvatar user={user} />
        </div>
        {user.isOwnProfile && (
          <div className="ml-4 rounded-md">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpdateAvatar(e.target.files[0]);
                }
              }}
              className="mt-2 bg-gray-600 text-gray-300 placeholder-gray-400 rounded-md"
            />
          </div>
        )}
      </div>

      {user.isOwnProfile && (
        <div className="shadow rounded-lg p-0 mb-6">
          <h2 className="text-md mb-2 p-2 rounded-sm bg-[#e8d3e8ff]">Atualizar Informações</h2>
          <UpdateUserNameForm
            userId={user.id}
            initialName={user.name || ""}
            initialUsername={user.username || ""}
          />
        </div>
      )}

  
      <div className="shadow rounded-lg p-0 mb-6">
        <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
        {user.isOwnProfile && (
          <SocialsForm
            initialSocials={{
              indecent: user.socials?.indecent || "",
              whatsapp: user.socials?.whatsapp || "",
              instagram: user.socials?.instagram || "",
              tiktok: user.socials?.tiktok || "",
              facebook: user.socials?.facebook || "",
              pinterest: user.socials?.pinterest || "",
              twitter: user.socials?.twitter || "",
              youtube: user.socials?.youtube || "",
              onlyfans: user.socials?.onlyfans || "",
              privacySocial: user.socials?.privacySocial || "",
            }}
            userId={user.id}
          />
        )}
      </div>


      <section className="mb-6">
        <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
        {userStories.length > 0 ? (
          <div className="flex gap-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
                onClick={() => setSelectedStory(story.videoUrl)}
              >
                <Image
                  src={story.thumbnailUrl || "/indecent-top-logo.png"}
                  width={150}
                  height={150}
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
        <StoriesModal onClose={() => setSelectedStory(null)} videoUrl={selectedStory} />
      )}


      <section>
        <h2 className="text-md bg-[black/10] mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
*/



/*


"use client";

import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaPinterest, FaTwitter, FaYoutube, FaTelegram, FaLock } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";

type SocialsType = {
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



type ProfilePageProps = {
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

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ProfilePageProps) {
  const [socials, setSocials] = useState(user.socials || {});
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleSocialsChange = (platform: keyof SocialsType, value: string) => {
    setSocials((prev) => ({ ...prev, [platform]: value }));
  };
  
  const platformIcons: Record<string, JSX.Element> = {
   "indecent.top": (
    <Image
      src="/indecent-top-logo.png"
      alt="Indecent Logo"
      width={16}
      height={16}
      className="inline-block mr-0"
    />
  ),
    whatsapp: <FaWhatsapp />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    facebook: <FaFacebook />,
    pinterest: <FaPinterest />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />,
    telegram: <FaTelegram />,
    "onlyfans": (
    <Image
      src="/onlyfans.png"
      alt="OnlyFans Logo"
      width={20}
      height={20}
      className="inline-block mr-0"
    />
  ),
    privacySocial: <FaLock />,
  };
  

  //* link indecent.top 
  const getSocialLink = (platform: string, username: string) => {
    if (platform === "indecent") {
      return `https://www.indecent.top/${username}`;
    }
    return socials[platform as keyof typeof socials] || "";
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("/api/update-socials", {
        userId: user.id, // ID do usuário atual
        socials, // Redes sociais atualizadas
      });
  
      if (response.status === 200) {
        alert("Redes sociais atualizadas com sucesso!");
      } else {
        throw new Error("Erro ao salvar redes sociais.");
      }
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      alert("Erro ao salvar redes sociais.");
    } finally {
      setIsSaving(false);
    }
  };
  
  
  

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post("/api/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const { url } = uploadResponse.data;

        await axios.post("/api/update-avatar", { userId: user.id, avatarUrl: url });

        alert("Avatar atualizado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  return (
    <div className="container md:w-[60%] w-full pt-4 md:text-lg text-[12px]">
      <div className="flex justify-between items-center md:pt-[5%]  pt-[8%]">
        <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2"> {user.name}</h1>
        {verifiedProfile === "VERIFIED" ? (
          <span className="text-green-500">Perfil Verificado ✅</span>
        ) : (
          user.isOwnProfile && (
            <button
              onClick={handleRequestVerification}
              className="md:ml-4 ml-1 bg-[#e8d3e8ff] text-gray-300 hover:bg-gray-600 md:px-2 px-1 py-1 rounded"
            >
              {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
            </button>
          )
        )}
      </div>

      <div className="flex items-center md:mb-4 mb-2">
        <div className="w-16 h-16">
          <UserAvatar user={user} />
        </div>
        {user.isOwnProfile && (
          <div className="ml-4 rounded-md">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpdateAvatar(e.target.files[0]);
                }
              }}
              className="mt-2 bg-gray-600 text-gray-300 placeholder-gray-400 rounded-md"
            />
          </div>
        )}
      </div>

      {user.isOwnProfile && (
        <div className=" shadow rounded-lg p-0 mb-6">
          <h2 className="text-md mb-2 p-2 rounded-sm bg-[#e8d3e8ff]">Atualizar Informações</h2>
          <UpdateUserNameForm
            userId={user.id}
            initialName={user.name || ""}
            initialUsername={user.username || ""}
          />
        </div>
      )}

<div className="shadow rounded-lg p-0 mb-6">
  <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
  {user.isOwnProfile ? (
    <div className="grid grid-cols-1 gap-2">
      {Object.keys(platformIcons).map((platform) => (
        <div key={platform} className="flex items-center">
          <span className="mr-2">{platformIcons[platform]}</span>
          <input
            type="text"
            value={
              platform === "indecent.top"
                ? `www.indecent.top/${user.username}`
                : socials[platform as keyof typeof socials] || ""
            }
            onChange={(e) =>
              handleSocialsChange(
                platform as keyof typeof socials,
                e.target.value
              )
            }
            placeholder={`Digite seu ${platform}`}
            className="w-full p-2 border bg-gray-600 text-gray-300 placeholder-gray-400 rounded-md"
            readOnly={platform === "indecent.top"} // Impede edição para "indecent.top"
          />
        </div>
      ))}
      <button
        onClick={handleSaveSocials}
        disabled={isSaving}
        className="mt-4 text-gray-300 px-4 p-2 rounded-sm bg-[#e8d3e8ff] hover:bg-gray-600 "
      >
        {isSaving ? "Salvando..." : "Salvar Redes Sociais"}
      </button>
    </div>
  ) : (
    <ul className="space-y-2">
     {Object.entries(socials).map(([platform, value]) =>
  value ? (
    <li key={platform} className="flex items-center">
      <span className="mr-2">{platformIcons[platform]}</span>
      <a
        href={
          platform === "whatsapp"
            ? `https://wa.me/${value}`
            : platform === "indecent.top"
            ? `https://www.indecent.top/${user.username}`
            : value.startsWith("http")
            ? value
            : `https://${value}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#ddc897] hover:underline"
      >
        {platform === "indecent.top" ? `www.indecent.top/${user.username}` : value}
      </a>
    </li>
  ) : null
)}

    </ul>
  )}
</div>


<section className="mb-6">
  <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
  {userStories.length > 0 ? (
    <div className="flex gap-4">
      {userStories.map((story) => (
        <div
          key={story.id}
          className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
          onClick={() => {
            if (story.videoUrl) {
              setSelectedStory(story.videoUrl);
            } else {
              alert("Erro: URL do vídeo não encontrada.");
            }
          }}
        >
          <Image
            src={story.thumbnailUrl || "/indecent-top-logo.png"}
            width={150}
            height={150}
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
        <h2 className="text-md bg-[black/10] mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
*/



/*


"use client"; ultimo valido antes da s3

import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaPinterest, FaTwitter, FaYoutube, FaTelegram, FaLock } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";

type ClientProfilePageProps = {
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

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ClientProfilePageProps) {
  const [socials, setSocials] = useState(user.socials || {});
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleSocialsChange = (key: keyof typeof socials, value: string) => {
    setSocials((prev) => ({ ...prev, [key]: value }));
  };

  const platformIcons: Record<string, JSX.Element> = {
   "indecent.top": (
    <Image
      src="/indecent-top-logo.png"
      alt="Indecent Logo"
      width={16}
      height={16}
      className="inline-block mr-0"
    />
  ),
    whatsapp: <FaWhatsapp />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    facebook: <FaFacebook />,
    pinterest: <FaPinterest />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />,
    telegram: <FaTelegram />,
    "onlyfans": (
    <Image
      src="/onlyfans.png"
      alt="OnlyFans Logo"
      width={20}
      height={20}
      className="inline-block mr-0"
    />
  ),
    privacy: <FaLock />,
  };
  

  //* link indecent.top 
  const getSocialLink = (platform: string, username: string) => {
    if (platform === "indecent") {
      return `https://www.indecent.top/${username}`;
    }
    return socials[platform as keyof typeof socials] || "";
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("/api/update-socials", {
        userId: user.id,
        socials,
      });

      if (response.status === 200) {
        alert("Redes sociais atualizadas com sucesso!");
      } else {
        throw new Error("Erro ao salvar redes sociais.");
      }
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      alert("Erro ao salvar redes sociais.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post("/api/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const { url } = uploadResponse.data;

        await axios.post("/api/update-avatar", { userId: user.id, avatarUrl: url });

        alert("Avatar atualizado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  return (
    <div className="container md:w-[60%] w-full pt-4 md:text-lg text-[12px]">
      <div className="flex justify-between items-center md:pt-[5%]  pt-[8%]">
        <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2"> {user.name}</h1>
        {verifiedProfile === "VERIFIED" ? (
          <span className="text-green-500">Perfil Verificado ✅</span>
        ) : (
          user.isOwnProfile && (
            <button
              onClick={handleRequestVerification}
              className="md:ml-4 ml-1 bg-[#e8d3e8ff] text-gray-300 hover:bg-gray-600 md:px-2 px-1 py-1 rounded"
            >
              {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
            </button>
          )
        )}
      </div>

      <div className="flex items-center md:mb-4 mb-2">
        <div className="w-16 h-16">
          <UserAvatar user={user} />
        </div>
        {user.isOwnProfile && (
          <div className="ml-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpdateAvatar(e.target.files[0]);
                }
              }}
              className="mt-2"
            />
          </div>
        )}
      </div>

      {user.isOwnProfile && (
        <div className=" shadow rounded-lg p-0 mb-6">
          <h2 className="text-md mb-2 p-2 rounded-sm bg-[#e8d3e8ff]">Atualizar Informações</h2>
          <UpdateUserNameForm
            userId={user.id}
            initialName={user.name || ""}
            initialUsername={user.username || ""}
          />
        </div>
      )}

<div className="shadow rounded-lg p-0 mb-6">
  <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
  {user.isOwnProfile ? (
    <div className="grid grid-cols-1 gap-2">
      {Object.keys(platformIcons).map((platform) => (
        <div key={platform} className="flex items-center">
          <span className="mr-2">{platformIcons[platform]}</span>
          <input
            type="text"
            value={
              platform === "indecent.top"
                ? `www.indecent.top/${user.username}`
                : socials[platform as keyof typeof socials] || ""
            }
            onChange={(e) =>
              handleSocialsChange(
                platform as keyof typeof socials,
                e.target.value
              )
            }
            placeholder={`Digite seu ${platform}`}
            className="w-full p-2 border rounded"
            readOnly={platform === "indecent.top"} // Impede edição para "indecent.top"
          />
        </div>
      ))}
      <button
        onClick={handleSaveSocials}
        disabled={isSaving}
        className="mt-4 text-gray-300 px-4 p-2 rounded-sm bg-[#e8d3e8ff] hover:bg-gray-600 "
      >
        {isSaving ? "Salvando..." : "Salvar Redes Sociais"}
      </button>
    </div>
  ) : (
    <ul className="space-y-2">
      {Object.entries(socials).map(([platform, value]) =>
        value ? (
          <li key={platform} className="flex items-center">
            <span className="mr-2">{platformIcons[platform]}</span>
            <a
                    href={
                      platform === "whatsapp"
                        ? `https://wa.me/${value.replace(/\D/g, "")}`
                        : platform === "indecent.top"
                        ? `https://www.indecent.top/${user.username}`
                        : value.startsWith("http")
                        ? value
                        : `https://${value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ddc897] hover:underline"
                  >
                    {platform === "indecent.top" ? `www.indecent.top/${user.username}` : value}
                  </a>
          </li>
        ) : null
      )}
    </ul>
  )}
</div>


      <section className="mb-6">
        <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
        {userStories.length > 0 ? (
          <div className="flex gap-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
                onClick={() => setSelectedStory(story.videoUrl)}
              >
                <Image
                  src={story.thumbnailUrl || "/indecent-top-logo.png"}
                  width={150}
                  height={150}
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
        <h2 className="text-md bg-[black/10] mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
*/



/*
"use client";

import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaPinterest, FaTwitter, FaYoutube, FaTelegram, FaLock } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";

type ClientProfilePageProps = {
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

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ClientProfilePageProps) {
  const [socials, setSocials] = useState(user.socials || {});
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleSocialsChange = (key: keyof typeof socials, value: string) => {
    setSocials((prev) => ({ ...prev, [key]: value }));
  };

  const platformIcons: Record<string, JSX.Element> = {
   "indecent.top": (
    <Image
      src="/indecent-top-logo.png"
      alt="Indecent Logo"
      width={16}
      height={16}
      className="inline-block mr-0"
    />
  ),
    whatsapp: <FaWhatsapp />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    facebook: <FaFacebook />,
    pinterest: <FaPinterest />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />,
    telegram: <FaTelegram />,
    "onlyfans": (
    <Image
      src="/onlyfans.png"
      alt="OnlyFans Logo"
      width={20}
      height={20}
      className="inline-block mr-0"
    />
  ),
    privacy: <FaLock />,
  };
  

  //* link indecent.top 
  const getSocialLink = (platform: string, username: string) => {
    if (platform === "indecent") {
      return `https://www.indecent.top/${username}`;
    }
    return socials[platform as keyof typeof socials] || "";
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("/api/update-socials", {
        userId: user.id,
        socials,
      });

      if (response.status === 200) {
        alert("Redes sociais atualizadas com sucesso!");
      } else {
        throw new Error("Erro ao salvar redes sociais.");
      }
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      alert("Erro ao salvar redes sociais.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post("/api/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const { url } = uploadResponse.data;

        await axios.post("/api/update-avatar", { userId: user.id, avatarUrl: url });

        alert("Avatar atualizado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  return (
    <div className="container md:w-[60%] w-full pt-4 md:text-lg text-[12px]">
      <div className="flex justify-between items-center md:pt-[5%]  pt-[8%]">
        <h1 className="md:text-lg text-[12px] text-[#ddc897] pb-2"> {user.name}</h1>
        {verifiedProfile === "VERIFIED" ? (
          <span className="text-green-500">Perfil Verificado ✅</span>
        ) : (
          user.isOwnProfile && (
            <button
              onClick={handleRequestVerification}
              className="md:ml-4 ml-1 bg-[#e8d3e8ff] text-gray-300 hover:bg-gray-600 md:px-2 px-1 py-1 rounded"
            >
              {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
            </button>
          )
        )}
      </div>

      <div className="flex items-center md:mb-4 mb-2">
        <div className="w-16 h-16">
          <UserAvatar user={user} />
        </div>
        {user.isOwnProfile && (
          <div className="ml-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpdateAvatar(e.target.files[0]);
                }
              }}
              className="mt-2"
            />
          </div>
        )}
      </div>

      {user.isOwnProfile && (
        <div className=" shadow rounded-lg p-0 mb-6">
          <h2 className="text-md mb-2 p-2 rounded-sm bg-[#e8d3e8ff]">Atualizar Informações</h2>
          <UpdateUserNameForm
            userId={user.id}
            initialName={user.name || ""}
            initialUsername={user.username || ""}
          />
        </div>
      )}

<div className="shadow rounded-lg p-0 mb-6">
  <h2 className="text-md mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Redes Sociais</h2>
  {user.isOwnProfile ? (
    <div className="grid grid-cols-1 gap-2">
      {Object.keys(platformIcons).map((platform) => (
        <div key={platform} className="flex items-center">
          <span className="mr-2">{platformIcons[platform]}</span>
          <input
            type="text"
            value={
              platform === "indecent.top"
                ? `www.indecent.top/${user.username}`
                : socials[platform as keyof typeof socials] || ""
            }
            onChange={(e) =>
              handleSocialsChange(
                platform as keyof typeof socials,
                e.target.value
              )
            }
            placeholder={`Digite seu ${platform}`}
            className="w-full p-2 border rounded"
            readOnly={platform === "indecent.top"} // Impede edição para "indecent.top"
          />
        </div>
      ))}
      <button
        onClick={handleSaveSocials}
        disabled={isSaving}
        className="mt-4 text-gray-300 px-4 p-2 rounded-sm bg-[#e8d3e8ff] hover:bg-gray-600 "
      >
        {isSaving ? "Salvando..." : "Salvar Redes Sociais"}
      </button>
    </div>
  ) : (
    <ul className="space-y-2">
      {Object.entries(socials).map(([platform, value]) =>
        value ? (
          <li key={platform} className="flex items-center">
            <span className="mr-2">{platformIcons[platform]}</span>
            <a
                    href={
                      platform === "whatsapp"
                        ? `https://wa.me/${value.replace(/\D/g, "")}`
                        : platform === "indecent.top"
                        ? `https://www.indecent.top/${user.username}`
                        : value.startsWith("http")
                        ? value
                        : `https://${value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ddc897] hover:underline"
                  >
                    {platform === "indecent.top" ? `www.indecent.top/${user.username}` : value}
                  </a>
          </li>
        ) : null
      )}
    </ul>
  )}
</div>


      <section className="mb-6">
        <h2 className="text-md p-2 rounded-sm bg-[#e8d3e8ff] mb-4">Meus Stories</h2>
        {userStories.length > 0 ? (
          <div className="flex gap-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="w-24 h-24 overflow-hidden cursor-pointer border-spacing-4"
                onClick={() => setSelectedStory(story.videoUrl)}
              >
                <Image
                  src={story.thumbnailUrl || "/indecent-top-logo.png"}
                  width={150}
                  height={150}
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
        <h2 className="text-md bg-[black/10] mb-4 p-2 rounded-sm bg-[#e8d3e8ff]">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
*/
 
/* em produção ok
"use client";

import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaPinterest, FaTwitter, FaYoutube, FaTelegram, FaLock } from "react-icons/fa";
import { BiLink } from "react-icons/bi";
import { useState } from "react";
import axios from "axios";
import UserAvatar from "@/components/UserAvatar";
import PostsGrid from "@/components/PostsGrid";
import { PostWithExtras } from "@/lib/definitions";
import Image from "next/image";
import StoriesModal from "@/components/StoriesModal";
import UpdateUserNameForm from "@/components/UpdateUserNameForm";

type ClientProfilePageProps = {
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

function ClientProfilePage({
  user,
  userPosts,
  userStories,
}: ClientProfilePageProps) {
  const [socials, setSocials] = useState(user.socials || {});
  const [verifiedProfile, setVerifiedProfile] = useState(
    user.verifiedProfile || "NOTVERIFIED"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const handleSocialsChange = (key: keyof typeof socials, value: string) => {
    setSocials((prev) => ({ ...prev, [key]: value }));
  };

  const platformIcons: Record<string, JSX.Element> = {
   "indecent.top": (
    <Image
      src="/indecent-top-logo.png"
      alt="Indecent Logo"
      width={16}
      height={16}
      className="inline-block mr-0"
    />
  ),
    whatsapp: <FaWhatsapp />,
    instagram: <FaInstagram />,
    tiktok: <FaTiktok />,
    facebook: <FaFacebook />,
    pinterest: <FaPinterest />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />,
    telegram: <FaTelegram />,
    "onlyfans": (
    <Image
      src="/onlyFans.png"
      alt="Indecent Logo"
      width={20}
      height={20}
      className="inline-block mr-0"
    />
  ),
    privacy: <FaLock />,
  };
  

  //* link indecent.top 
  const getSocialLink = (platform: string, username: string) => {
    if (platform === "indecent") {
      return `https://www.indecent.top/painel/${username}`;
    }
    return socials[platform as keyof typeof socials] || "";
  };

  const handleSaveSocials = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post("/api/update-socials", {
        userId: user.id,
        socials,
      });

      if (response.status === 200) {
        alert("Redes sociais atualizadas com sucesso!");
      } else {
        throw new Error("Erro ao salvar redes sociais.");
      }
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error);
      alert("Erro ao salvar redes sociais.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      if (!user.verificationPurchased) {
        alert("Você precisa adquirir a verificação antes de solicitar.");
        return;
      }

      await axios.post("/api/request-verification", { userId: user.id });
      setVerifiedProfile("VERIFIED");
      alert("Solicitação de verificação enviada!");
    } catch (error) {
      console.error("Erro ao solicitar verificação:", error);
      alert("Erro ao solicitar verificação.");
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await axios.post("/api/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadResponse.status === 200) {
        const { url } = uploadResponse.data;

        await axios.post("/api/update-avatar", { userId: user.id, avatarUrl: url });

        alert("Avatar atualizado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar.");
    }
  };

  return (
    <div className="container md:w-[60%] w-[80%] p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-md pb-2"> {user.name}</h1>
        {verifiedProfile === "VERIFIED" ? (
          <span className="text-green-500">Perfil Verificado ✅</span>
        ) : (
          user.isOwnProfile && (
            <button
              onClick={handleRequestVerification}
              className="ml-4 bg-gray-600 text-[#ddc897] px-2 py-1 rounded"
            >
              {user.verificationPurchased ? "Solicitar Verificação" : "Adquirir Verificação"}
            </button>
          )
        )}
      </div>

      <div className="flex items-center mb-4">
        <div className="w-16 h-16">
          <UserAvatar user={user} />
        </div>
        {user.isOwnProfile && (
          <div className="ml-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUpdateAvatar(e.target.files[0]);
                }
              }}
              className="mt-2"
            />
          </div>
        )}
      </div>

      {user.isOwnProfile && (
        <div className=" shadow rounded-lg p-0 mb-6">
          <h2 className="text-md mb-2">Atualizar Informações</h2>
          <UpdateUserNameForm
            userId={user.id}
            initialName={user.name || ""}
            initialUsername={user.username || ""}
          />
        </div>
      )}

<div className="shadow rounded-lg p-0 mb-6">
  <h2 className="text-md mb-4">Redes Sociais</h2>
  {user.isOwnProfile ? (
    <div className="grid grid-cols-1 gap-2">
      {Object.keys(platformIcons).map((platform) => (
        <div key={platform} className="flex items-center">
          <span className="mr-2">{platformIcons[platform]}</span>
          <input
            type="text"
            value={
              platform === "indecent.top"
                ? `www.indecent.top/painel/${user.username}`
                : socials[platform as keyof typeof socials] || ""
            }
            onChange={(e) =>
              handleSocialsChange(
                platform as keyof typeof socials,
                e.target.value
              )
            }
            placeholder={`Digite seu ${platform}`}
            className="w-full p-2 border rounded"
            readOnly={platform === "indecent.top"} // Impede edição para "indecent.top"
          />
        </div>
      ))}
      <button
        onClick={handleSaveSocials}
        disabled={isSaving}
        className="mt-4 bg-gray-600 text-[#ddc897] px-4 py-2 rounded"
      >
        {isSaving ? "Salvando..." : "Salvar Redes Sociais"}
      </button>
    </div>
  ) : (
    <ul className="space-y-2">
      {Object.entries(socials).map(([platform, value]) =>
        value ? (
          <li key={platform} className="flex items-center">
            <span className="mr-2">{platformIcons[platform]}</span>
            <a
              href={
                platform === "indecent.top"
                  ? `https://www.indecent.top/painel/${user.username}`
                  : value.startsWith("http")
                  ? value
                  : `https://${value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {value}
            </a>
          </li>
        ) : null
      )}
    </ul>
  )}
</div>


      <section className="mb-6">
        <h2 className="text-md bg-black/10 mb-4">Meus Stories</h2>
        {userStories.length > 0 ? (
          <div className="flex gap-4">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border border-gray-300"
                onClick={() => setSelectedStory(story.videoUrl)}
              >
                <Image
                  src={story.thumbnailUrl || "/indecent-top-logo.png"}
                  width={150}
                  height={150}
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
        <StoriesModal onClose={() => setSelectedStory(null)}>
          <video
            src={selectedStory}
            controls
            autoPlay
            className="max-w-full max-h-[80vh]"
          />
        </StoriesModal>
      )}

      <section>
        <h2 className="text-md bg-black/10 mb-4">Meus Posts</h2>
        {userPosts && userPosts.length > 0 ? (
          <PostsGrid posts={userPosts} />
        ) : (
          <p>Nenhum post encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default ClientProfilePage;
*/