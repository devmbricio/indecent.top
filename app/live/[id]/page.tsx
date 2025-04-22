"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { checkCreditsAndSubscription } from "@/actions/getInfluencerPosts";
import MonitorCredits from "@/components/MonitorCredits";
import DistributeOnRouteLeave from "@/components/DistributeOnRouteLeave";

export default function WatchLivePage() {
  const params = useParams();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);

  const fetchStreamDetails = async () => {
    if (!userId) return;

    try {
      const { subscriptionLevel, credits, error } = await checkCreditsAndSubscription(userId);
      if (error || ((credits ?? 0) <= 0 && subscriptionLevel === "free")) {
        console.warn("❌ Acesso negado: Assinatura ou créditos insuficientes");
        return;
      }

      setHasAccess(true);
      setUserCredits(credits ?? 0);

      const response = await fetch(`/api/live/${userId}`);
      const data = await response.json();

      if (data.error || !data.playbackUrl) {
        console.error("❌ Erro ao obter detalhes da live:", data.error);
        return;
      }

      setPlaybackUrl(data.playbackUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error("❌ Erro ao buscar detalhes da live:", error);
    }
  };

  useEffect(() => {
    if (!hasAccess || !playbackUrl || !videoRef.current) return;

    if (playerRef.current) {
      playerRef.current.dispose();
    }

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: "auto",
      fluid: true,
      sources: [
        {
          src: playbackUrl,
          type: "application/x-mpegURL",
        },
      ],
    });

    playerRef.current.on("error", (err: any) => {
      console.error("❌ Erro no player:", err);
    });
  }, [hasAccess, playbackUrl]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">Assistindo Live</h2>
      <MonitorCredits userId={userId} credits={userCredits} influencerId={userId} />
      <DistributeOnRouteLeave viewerId={userId} influencerId={userId} />
      {!isPlaying ? (
        <button
          onClick={fetchStreamDetails}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Iniciar Visualização
        </button>
      ) : (
        hasAccess ? (
          <video key={playbackUrl} ref={videoRef} className="video-js vjs-default-skin w-full max-w-3xl" />
        ) : (
          <p className="text-red-500">Acesso negado. Assinatura ou créditos insuficientes.</p>
        )
      )}
    </div>
  );
}

/* prfeito rodando 100%
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function WatchLivePage() {
  const params = useParams();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchStreamDetails = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/live/${userId}`);
      const data = await response.json();

      if (data.error || !data.playbackUrl) {
        console.error("❌ Erro ao obter detalhes da live:", data.error);
        return;
      }

      setPlaybackUrl(data.playbackUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error("❌ Erro ao buscar detalhes da live:", error);
    }
  };

  useEffect(() => {
    if (!playbackUrl || !videoRef.current) return;

    if (playerRef.current) {
      playerRef.current.dispose();
    }

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: "auto",
      fluid: true,
      sources: [
        {
          src: playbackUrl,
          type: "application/x-mpegURL",
        },
      ],
    });

    playerRef.current.on("error", (err: any) => {
      console.error("❌ Erro no player:", err);
    });
  }, [playbackUrl]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">Assistindo Live</h2>
      {!isPlaying ? (
        <button
          onClick={fetchStreamDetails}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Iniciar Visualização
        </button>
      ) : (
        <video key={playbackUrl} ref={videoRef} className="video-js vjs-default-skin w-full max-w-3xl" />
      )}
    </div>
  );
}
*/