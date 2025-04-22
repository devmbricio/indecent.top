"use client";

import CommentForm from "@/components/CommentForm";
import PostActions from "@/components/PostActions";
import UserAvatar from "@/components/UserAvatar";
import ViewPost from "@/components/ViewPost";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMount from "@/hooks/useMount";
import { PostWithExtras } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import MiniPost from "./MiniPost";
import Comment from "./Comment";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, EffectCreative } from "swiper/modules";
import Head from "next/head";

function PostView({ id, post }: { id: string; post: PostWithExtras }) {
  const pathname = usePathname();
  const isPostModal = pathname === `/painel/p/${id}`;
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const inputRef = useRef<HTMLInputElement>(null);
  const canonicalUrl = `https://indecent.top/painel/p/${id}`;
  const mount = useMount();

  const hasDetails = !!(
    post.nome ||
    post.age ||
    post.peso ||
    post.dote ||
    post.valor ||
    post.city ||
    post.country
  );

  // Função para verificar se é vídeo
  const isVideo = (url: string) => {
    return (
      url.endsWith(".mp4") ||
      url.endsWith(".mov") ||
      url.endsWith(".ogg") ||
      url.endsWith(".webm")
    );
  };

  if (!mount) return null;

  return (
    <>
      <Head>
        <title>{post.title || "Post Anônimo"} - Indecent</title>
        <meta
          name="description"
          content={
            post.description ||
            "Confira este post exclusivo no Indecent, com conteúdos incríveis e originais."
          }
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title || "Post Anônimo"} />
        <meta
          property="og:description"
          content={post.description || "Confira este conteúdo exclusivo no Indecent!"}
        />
      </Head>

      <Dialog open={isPostModal} onOpenChange={(open) => !open && router.back()}>
        <DialogContent className="dialog-content flex flex-col md:flex-row gap-4 md:max-w-4xl w-full h-auto">
          <div className="md:w-1/2 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <MiniPost post={post} />
              {hasDetails && (
                <div className="text-sm space-y-2 mt-4">
                  {post.nome && <p><strong>Nome:</strong> {post.nome}</p>}
                  {post.age && <p><strong>Idade:</strong> {post.age}</p>}
                </div>
              )}
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} inputRef={inputRef} />
              ))}
            </ScrollArea>
          </div>
          <div className="relative w-full md:w-1/2">
            {post.fileUrls && post.fileUrls.length > 0 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                navigation={true}
                grabCursor={true}
                effect="creative"
                creativeEffect={{
                  prev: { shadow: true, translate: [0, 0, -400] },
                  next: { translate: ["100%", 0, 0] },
                }}
                modules={[EffectCreative, Navigation]}
                className="w-full h-full object-cover overflow-hidden"
              >
                {post.fileUrls.map((url, index) =>
                  isVideo(url) ? (
                    <SwiperSlide key={index}>
                      <video
                        src={url}
                        loop={true}
                        //controls
                        autoPlay
                        playsInline
                        className="w-full h-auto max-h-[90vh] object-cover rounded-md"
                      />
                    </SwiperSlide>
                  ) : (
                    <SwiperSlide key={index}>
                      <Image
                        src={url}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                        unoptimized
                      />
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            ) : (
              <p className="text-center">Sem imagens ou vídeos disponíveis</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PostView;


/*

"use client";

import CommentForm from "@/components/CommentForm";
import PostActions from "@/components/PostActions";
import UserAvatar from "@/components/UserAvatar";
import ViewPost from "@/components/ViewPost";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMount from "@/hooks/useMount";
import { PostWithExtras } from "@/lib/definitions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import MiniPost from "./MiniPost";
import Comment from "./Comment";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, EffectCreative } from "swiper/modules";
import Head from "next/head";

function PostView({ id, post }: { id: string; post: PostWithExtras }) {
  const pathname = usePathname();
  const isPostModal = pathname === `/painel/p/${id}`;
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const inputRef = useRef<HTMLInputElement>(null);
  const canonicalUrl = `https://indecent.top/painel/p/${id}`;
  const mount = useMount();

  const hasDetails = !!(
    post.nome ||
    post.age ||
    post.peso ||
    post.dote ||
    post.valor ||
    post.city ||
    post.country
  );

  if (!mount) return null;

  return (
    <>
      <Head>
        <title>{post.title || "Post Anônimo"} - Indecent</title>
        <meta
          name="description"
          content={
            post.description ||
            "Confira este post exclusivo no Indecent, com conteúdos incríveis e originais."
          }
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title || "Post Anônimo"} />
        <meta
          property="og:description"
          content={
            post.description || "Confira este conteúdo exclusivo no Indecent!"
          }
        />
      </Head>

      <Dialog open={isPostModal} onOpenChange={(open) => !open && router.back()}>
        <DialogContent className="dialog-content flex flex-col md:flex-row gap-4 md:max-w-4xl w-full h-auto">
          <div className="md:w-1/2 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <MiniPost post={post} />
              {hasDetails && (
                <div className="text-sm space-y-2 mt-4">
                  {post.nome && <p><strong>Nome:</strong> {post.nome}</p>}
                  {post.age && <p><strong>Idade:</strong> {post.age}</p>}
                </div>
              )}
              {post.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} inputRef={inputRef} />
              ))}
            </ScrollArea>
          </div>
          <div className="relative w-full md:w-1/2">
            {post.fileUrls && post.fileUrls.length > 0 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                navigation={true}
                grabCursor={true}
                effect="creative"
                creativeEffect={{
                  prev: { shadow: true, translate: [0, 0, -400] },
                  next: { translate: ["100%", 0, 0] },
                }}
                modules={[EffectCreative, Navigation]}
                className="w-full h-full object-cover overflow-hidden"
              >
                {post.fileUrls.map((url, index) =>
                  url.endsWith(".mp4 , .mov , .ogg , .webm") ? (
                    <SwiperSlide key={index}>
                      <video
                        src={url}
                        controls
                        className="w-full h-auto max-h-[16/9] md:max-h-[800px] lg:max-h-[700px] object-cover"
                      />
                    </SwiperSlide>
                  ) : (
                    <SwiperSlide key={index}>
                      <Image
                        src={url}
                        alt={`Post image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                        unoptimized
                      />
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            ) : (
              <p className="text-center">Sem imagens ou vídeos disponíveis</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PostView;
*/