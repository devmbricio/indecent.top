"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { PostWithExtras } from "@/lib/definitions";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import Comments from "./Comments";
import Timestamp from "./Timestamp";
import PostOptions from "./PostOptions";
import PostActions from "./PostActions";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import ImageWithErrorHandler from "./ImageWithErrorHandler";
import { Navigation, EffectCreative } from "swiper/modules";
import { FaPlay, FaPause, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
 

function Post({ post }: { post: PostWithExtras }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const username = post.user.username;

  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null); // Para controlar o vídeo ativo

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]); // Usando useRef para múltiplos vídeos
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];

  useEffect(() => {
    if (post.fileUrls && post.fileUrls.length > 0) {
      setFileUrls(post.fileUrls);
    } else {
      setFileUrls(["/indecent-top-logo-rosa-transparent-1080.png"]);
    }
  }, [post.fileUrls]);

  const isVideo = (url: string) => videoExtensions.some((ext) => url.endsWith(ext));

  const toggleDetails = () => setShowDetails((prev) => !prev);

  // Função para verificar visibilidade do vídeo
  const handlePlayPause = (index: number) => {
    // Pause todos os vídeos
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
      }
    });

    if (videoRefs.current[index]) {
      if (isPlaying) {
        videoRefs.current[index].pause();
      } else {
        videoRefs.current[index].play();
      }
      setIsPlaying(!isPlaying);
      setActiveVideoIndex(isPlaying ? null : index); // Atualiza o índice do vídeo ativo
    }
  };

  const showPlayPauseControls = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowControls(false), 2000);
  };

  // Função para definir o índice do vídeo ativo
  const handleSetActiveVideoIndex = (index: number | null) => {
    setActiveVideoIndex(index);
  };

  // Função que cria o IntersectionObserver para controlar a visibilidade dos vídeos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const video = videoRefs.current[index];
          if (entry.isIntersecting && video) {
            video.play(); // Inicia o vídeo quando ele entra na tela
            setActiveVideoIndex(index); // Atualiza o índice do vídeo ativo
          } else if (video) {
            video.pause(); // Pausa o vídeo quando ele sai da tela
            if (activeVideoIndex === index) {
              setActiveVideoIndex(null); // Reseta o índice do vídeo ativo
            }
          }
        });
      },
      { threshold: 0.5 } // O vídeo precisa estar 50% visível para começar a tocar
    );

    // Observa cada vídeo
    const currentVideoRefs = videoRefs.current; // Armazena o valor atual de videoRefs
    currentVideoRefs.forEach((video) => {
      if (video) observer.observe(video);
    });

    // Limpa o observer quando o componente for desmontado
    return () => {
      currentVideoRefs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [activeVideoIndex]);

  return (
    <div className="flex flex-col w-full lg:max-w-md max-w-xl space-y-2.5 pt-[5%] overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-0 overflow-hidden">
        <div className="flex space-x-3 items-center">
          <UserAvatar user={post.user} />
          <div className="text-sm">
            <p className="space-x-1">
              <Link href={`/${username}`} className="font-semibold">
                {post.user.name}
              </Link>
              <span className="font-medium text-xs"> • </span>
             
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {post.city}, {post.country}
            </p>
          </div>
        </div>
        <PostOptions post={post} userId={userId} />
      </div>

 
      <div className="relative aspect-[9/16] w-full max-w-md rounded-lg sm:rounded-md overflow-hidden">
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
          {fileUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                {isVideo(url) ? (
                 <video
                 ref={(el) => {
                   videoRefs.current[index] = el;
                 }}
                 src={url}
                 loop
                 playsInline
                 muted
                 className="w-full h-full object-cover overflow-hidden"
                 data-index={index}
                 onLoadedMetadata={(e) => {
                   const video = e.currentTarget;
                   // Espera os metadados carregarem
                   if (video.readyState >= 1) {
                     // Garante que o segundo 3 existe
                     const targetTime = video.duration > 3 ? 3 : video.duration / 2;
                     video.currentTime = targetTime;
               
                     // Quando o vídeo terminar de buscar esse frame, ele pausa
                     video.onseeked = () => {
                       video.pause();
                     };
                   }
                 }}
                 onPause={() => handleSetActiveVideoIndex(null)}
                 onPlay={() => handleSetActiveVideoIndex(index)}
               />
               
               
                ) : (
                  <ImageWithErrorHandler
                    src={url}
                    alt="Imagem do Post"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="sm:rounded-md object-cover w-full h-full overflow-hidden"
                    unoptimized
                  />
                )}
              </div>
              {isVideo(url) && showControls && (
  <button
    onClick={(e) => {
      e.preventDefault();
      handlePlayPause(index);
    }}
    className="absolute inset-0 flex items-center justify-center rounded-full w-16 h-16 m-auto text-[#f19ddc] text-4xl transition-opacity opacity-20 duration-300 z-50"
  >
    {isPlaying && activeVideoIndex === index ? <FaPause /> : <FaPlay />}
  </button>
)}

            </SwiperSlide>
          ))}
        </Swiper>
      </div>

 
      <div className="flex justify-center items-center">
        <div className="p-4">
          <button
            onClick={toggleDetails}
            className="w-8 h-8 bg-[#EC9EC5] rounded-full"
          >
            <Image
              src="/job.png"
              alt="Toggle Details"
              width={150}
              height={150}
              className="object-contain"
            />
          </button>
        </div>
      </div>

   
      {showDetails && (
        <div className="text-sm space-y-1.5 mt-2">
          {post.nome && <p><strong>Nome:</strong> {post.nome}</p>}
          {post.age && <p><strong>Idade:</strong> {post.age}</p>}
          {post.peso && <p><strong>Peso:</strong> {post.peso}</p>}
          {post.dote && <p><strong>Dote:</strong> {post.dote}</p>}
          {post.valor && <p><strong>Valor:</strong> {post.valor}</p>}
          {post.city && <p><strong>Local:</strong> {post.city}</p>}
          {post.country && <p><strong>País:</strong> {post.country}</p>}
          {post.whatsapp && (
            <p>
              <a
                href={`https://wa.me/${post.whatsapp}?text=${encodeURIComponent(
                  "Olá! Encontrei você no www.indecent.top, podemos conversar?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-500 hover:text-green-600"
              >
                <FaWhatsapp className="w-5 h-5 inline-block" />
              </a>
            </p>
          )}
        </div>
      )}

      <PostActions post={post} userId={userId} className="px-3 sm:px-0" />
      {post.caption && (
        <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
          <p>{post.caption}</p>
        </div>
      )}
      <Comments postId={post.id} comments={post.comments} user={session?.user} />
    </div>
  );
}

export default Post;

/*
"use client"; //antes do jackpot

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { PostWithExtras } from "@/lib/definitions";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import Comments from "./Comments";
import Timestamp from "./Timestamp";
import PostOptions from "./PostOptions";
import PostActions from "./PostActions";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import ImageWithErrorHandler from "./ImageWithErrorHandler";
import { Navigation, EffectCreative } from "swiper/modules";
import { FaPlay, FaPause, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

function Post({ post }: { post: PostWithExtras }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const username = post.user.username;

  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null); // Para controlar o vídeo ativo

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]); // Usando useRef para múltiplos vídeos
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];

  useEffect(() => {
    if (post.fileUrls && post.fileUrls.length > 0) {
      setFileUrls(post.fileUrls);
    } else {
      setFileUrls(["/indecent-top-logo-rosa-transparent-1080.png"]);
    }
  }, [post.fileUrls]);

  const isVideo = (url: string) => videoExtensions.some((ext) => url.endsWith(ext));

  const toggleDetails = () => setShowDetails((prev) => !prev);

  // Função para verificar visibilidade do vídeo
  const handlePlayPause = (index: number) => {
    // Pause todos os vídeos
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video) {
        video.pause();
      }
    });

    if (videoRefs.current[index]) {
      if (isPlaying) {
        videoRefs.current[index].pause();
      } else {
        videoRefs.current[index].play();
      }
      setIsPlaying(!isPlaying);
      setActiveVideoIndex(isPlaying ? null : index); // Atualiza o índice do vídeo ativo
    }
  };

  const showPlayPauseControls = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowControls(false), 2000);
  };

  // Função para definir o índice do vídeo ativo
  const handleSetActiveVideoIndex = (index: number | null) => {
    setActiveVideoIndex(index);
  };

  // Função que cria o IntersectionObserver para controlar a visibilidade dos vídeos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const video = videoRefs.current[index];
          if (entry.isIntersecting && video) {
            video.play(); // Inicia o vídeo quando ele entra na tela
            setActiveVideoIndex(index); // Atualiza o índice do vídeo ativo
          } else if (video) {
            video.pause(); // Pausa o vídeo quando ele sai da tela
            if (activeVideoIndex === index) {
              setActiveVideoIndex(null); // Reseta o índice do vídeo ativo
            }
          }
        });
      },
      { threshold: 0.5 } // O vídeo precisa estar 50% visível para começar a tocar
    );

    // Observa cada vídeo
    const currentVideoRefs = videoRefs.current; // Armazena o valor atual de videoRefs
    currentVideoRefs.forEach((video) => {
      if (video) observer.observe(video);
    });

    // Limpa o observer quando o componente for desmontado
    return () => {
      currentVideoRefs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [activeVideoIndex]);

  return (
    <div className="flex flex-col w-full lg:max-w-md max-w-xl space-y-2.5 pt-[5%] overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-0 overflow-hidden">
        <div className="flex space-x-3 items-center">
          <UserAvatar user={post.user} />
          <div className="text-sm">
            <p className="space-x-1">
              <Link href={`/${username}`} className="font-semibold">
                {post.user.name}
              </Link>
              <span className="font-medium text-xs"> • </span>
             
            </p>
            <p className="text-xs text-gray-400 font-medium">
              {post.city}, {post.country}
            </p>
          </div>
        </div>
        <PostOptions post={post} userId={userId} />
      </div>

 
      <div className="relative aspect-[9/16] w-full max-w-md rounded-lg sm:rounded-md overflow-hidden">
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
          {fileUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                {isVideo(url) ? (
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }} // Atribuindo referências corretamente
                    src={url}
                    autoPlay={false}
                    loop
                    playsInline
                    className="w-full h-full object-cover overflow-hidden"
                    data-index={index} // Atributo personalizado para identificar o vídeo
                    onPause={() => handleSetActiveVideoIndex(null)} // Atualizando o índice do vídeo
                    onPlay={() => handleSetActiveVideoIndex(index)} // Definindo o índice do vídeo ativo
                  />
                ) : (
                  <ImageWithErrorHandler
                    src={url}
                    alt="Imagem do Post"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="sm:rounded-md object-cover w-full h-full overflow-hidden"
                    unoptimized
                  />
                )}
              </div>
              {showControls && (
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Evita a navegação ao clicar no botão Play/Pause
                    handlePlayPause(index);
                  }}
                  className="absolute inset-0 flex items-center justify-center  rounded-full w-16 h-16 m-auto text-[#f19ddc] text-4xl transition-opacity opacity-20 duration-300 z-50"
                >
                  {isPlaying && activeVideoIndex === index ? <FaPause /> : <FaPlay />}
                </button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

 
      <div className="flex justify-center items-center">
        <div className="p-4">
          <button
            onClick={toggleDetails}
            className="w-8 h-8 bg-[#EC9EC5] rounded-full"
          >
            <Image
              src="/job.png"
              alt="Toggle Details"
              width={150}
              height={150}
              className="object-contain"
            />
          </button>
        </div>
      </div>

   
      {showDetails && (
        <div className="text-sm space-y-1.5 mt-2">
          {post.nome && <p><strong>Nome:</strong> {post.nome}</p>}
          {post.age && <p><strong>Idade:</strong> {post.age}</p>}
          {post.peso && <p><strong>Peso:</strong> {post.peso}</p>}
          {post.dote && <p><strong>Dote:</strong> {post.dote}</p>}
          {post.valor && <p><strong>Valor:</strong> {post.valor}</p>}
          {post.city && <p><strong>Local:</strong> {post.city}</p>}
          {post.country && <p><strong>País:</strong> {post.country}</p>}
          {post.whatsapp && (
            <p>
              <a
                href={`https://wa.me/${post.whatsapp}?text=${encodeURIComponent(
                  "Olá! Encontrei você no www.indecent.top, podemos conversar?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-500 hover:text-green-600"
              >
                <FaWhatsapp className="w-5 h-5 inline-block" />
              </a>
            </p>
          )}
        </div>
      )}

      <PostActions post={post} userId={userId} className="px-3 sm:px-0" />
      {post.caption && (
        <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
          <p>{post.caption}</p>
        </div>
      )}
      <Comments postId={post.id} comments={post.comments} user={session?.user} />
    </div>
  );
}

export default Post;
*/


