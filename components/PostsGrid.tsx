"use client";

import { PostWithExtras } from "@/lib/definitions";
import { HeartIcon, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

function isVideoFile(url: string) {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

function PostsGrid({ posts }: { posts: PostWithExtras[] | undefined }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 max-w-2xl lg:max-w-3xl mx-auto pr-2 pl-2 pb-0">
        <p className="font-semibold text-sm text-gray-300">Nenhum post encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2">
      {posts.map((post) => {
        const totalLikes = (post.likes.length || 0) + (post.mLikes || 0);

        return (
          <Link
            href={`/painel/p/${post.id}`}
            key={post.id}
            className="relative flex items-center justify-center group col-span-1 w-full"
          >
            <div className="w-full aspect-[9/16] overflow-hidden rounded-md">
              <Swiper
                spaceBetween={5}
                slidesPerView={1}
                navigation={true}
                modules={[Navigation]}
                className="h-full w-full"
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 5 },
                  480: { slidesPerView: 1, spaceBetween: 10 },
                  768: { slidesPerView: 1, spaceBetween: 20 },
                  1024: { slidesPerView: 1, spaceBetween: 30 },
                }}
              >
                {post.fileUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    {isVideoFile(url) ? (
                      <video
                        src={url}
                        autoPlay
                        loop
                        playsInline
                        muted
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={`Imagem do Post ${index + 1}`}
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover rounded-md"
                        unoptimized
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Likes e Comentários */}
            <div className="absolute bottom-1 left-1 right-1 bg-[#e8d3e8ff] opacity-0 group-hover:opacity-100 transition flex justify-center items-center space-x-2 py-1 rounded-md z-50">
              {totalLikes > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <HeartIcon className="text-[#ddc897] fill-white" />
                  <p className="text-[#ddc897]">{totalLikes}</p>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <MessageCircle className="text-[#ddc897] fill-white" />
                  <p className="text-[#ddc897]">{post.comments.length}</p>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PostsGrid;


/* ultima versao nao renderiza posts em telas pequenas na rota [username]
"use client";

import { PostWithExtras } from "@/lib/definitions";
import { HeartIcon, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

function isVideoFile(url: string) {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

function PostsGrid({ posts }: { posts: PostWithExtras[] | undefined }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 max-w-2xl lg:max-w-3xl mx-auto pr-2 pl-2 pb-0">
        <p className="font-semibold text-sm text-gray-300">Nenhum post encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
      {posts.map((post) => {
        const totalLikes = (post.likes.length || 0) + (post.mLikes || 0);

        return (
          <Link
            href={`/painel/p/${post.id}`}
            key={post.id}
            className="relative flex items-center justify-center group col-span-1"
          >
            <div className="w-full aspect-[9/16] sm:aspect-[9/16] overflow-hidden rounded-md">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation={true}
                modules={[Navigation]}
                className="h-full w-full"
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 10 },
                  768: { slidesPerView: 1, spaceBetween: 20 },
                  1024: { slidesPerView: 1, spaceBetween: 30 },
                }}
              >
                {post.fileUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    {isVideoFile(url) ? (
                      <video
                        src={url}
                        //controls
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={`Imagem do Post ${index + 1}`}
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="absolute bottom-1 left-1 right-1 bo bg-[#e8d3e8ff] opacity-0 group-hover:opacity-100 transition flex justify-center items-center space-x-2 py-1 rounded-md z-50">
              {totalLikes > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <HeartIcon className="text-[#ddc897f] fill-white" />
                  <p className="text-[#ddc897]">{totalLikes}</p>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <MessageCircle className="text-[#ddc897] fill-white" />
                  <p className="text-[#ddc897]">{post.comments.length}</p>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PostsGrid;
*/

/* funcional mas em telas peuqenas nao roda o video
"use client";

import { PostWithExtras } from "@/lib/definitions";
import { HeartIcon, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

function isVideoFile(url: string) {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

function PostsGrid({ posts }: { posts: PostWithExtras[] | undefined }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 max-w-2xl lg:max-w-3xl mx-auto pr-2 pl-2 pb-0">
        <p className="font-semibold text-sm text-gray-300">Nenhum post encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2">
      {posts.map((post) => {
        const totalLikes = (post.likes.length || 0) + (post.mLikes || 0);

        return (
          <Link
            href={`/painel/p/${post.id}`}
            key={post.id}
            className="relative flex items-center justify-center group col-span-1"
          >
            <div className="w-full aspect-[9/16] overflow-hidden rounded-md">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation={true}
                modules={[Navigation]}
                className="h-full w-full"
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 10 },
                  768: { slidesPerView: 1, spaceBetween: 20 },
                  1024: { slidesPerView: 1, spaceBetween: 30 },
                }}
              >
                {post.fileUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    {isVideoFile(url) ? (
                      <video
                        src={url}
                        //controls
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={url}
                        alt={`Imagem do Post ${index + 1}`}
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-[#e8d3e8ff] opacity-0 group-hover:opacity-100 transition flex justify-center items-center space-x-2 py-1 rounded-md">
              {totalLikes > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <HeartIcon className="text-[#ddc897f] fill-white" />
                  <p className="text-[#ddc897]">{totalLikes}</p>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <MessageCircle className="text-[#ddc897] fill-white" />
                  <p className="text-[#ddc897]">{post.comments.length}</p>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PostsGrid;
*/


/* funcional mas nao renderiza 16/09 enem videos
use client";

import { PostWithExtras } from "@/lib/definitions";
import { HeartIcon, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importa os estilos básicos do Swiper
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

function isVideoFile(url: string) {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

function PostsGrid({ posts }: { posts: PostWithExtras[] | undefined }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 max-w-2xl lg:max-w-4xl mx-auto pr-2 pl-2 pb-0">
        <p className="font-semibold text-sm text-neutral-400">Nenhum post encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {posts.map((post) => {
        const totalLikes = (post.likes.length || 0) + (post.mLikes || 0);
        const hasImages =
          post.fileUrls &&
          post.fileUrls.some((url) => !isVideoFile(url)); // Verifica se há pelo menos uma imagem

        return (
          <Link
            href={`/painel/p/${post.id}`}
            key={post.id}
            className="relative flex items-center justify-center group col-span-1"
          >
            <div className="w-full h-full  aspect-[9/16]">
              {hasImages ? (
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation={true}
                  modules={[Navigation]}
                  className="h-full sm:h-[350px] w-full aspect-[9/16]"
                  breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 10 },
                    768: { slidesPerView: 1, spaceBetween: 20 },
                    1024: { slidesPerView: 1, spaceBetween: 30 },
                  }}
                >
                  {post.fileUrls.map((url, index) =>
                    !isVideoFile(url) ? (
                      <SwiperSlide key={index}>
                        <Image
                          src={url}
                          alt={`Imagem do Post ${index + 1}`}
                          width={500}
                          height={600}
                          className="object-cover sm:rounded-md aspect-[9/16]"
                          unoptimized
                        />
                      </SwiperSlide>
                    ) : null // Ignorar vídeos ao exibir as imagens
                  )}
                </Swiper>
              ) : (
                <Image
                  src="/indecent-top-logo-rosa-transparent.png"
                  alt="Imagem padrão para o post"
                  width={500}
                  height={500}
                  className="object-cover sm:rounded-md aspect-[9/16]"
                  unoptimized
                />
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-[#e8d3e8ff] opacity-0 group-hover:opacity-100 transition flex justify-center items-center space-x-2 py-1 rounded-md">
              {totalLikes > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <HeartIcon className="text-[#ddc897f] fill-white" />
                  <p className="text-[#ddc897]">{totalLikes}</p>
                </div>
              )}

              {post.comments.length > 0 && (
                <div className="flex items-center font-bold space-x-1">
                  <MessageCircle className="text-[#ddc897] fill-white" />
                  <p className="text-[#ddc897]">{post.comments.length}</p>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PostsGrid;

*/