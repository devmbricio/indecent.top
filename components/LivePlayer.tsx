"use client";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface LivePlayerProps {
  playbackUrl: string;
}

export default function LivePlayer({ playbackUrl }: LivePlayerProps) {
  const videoRef = useRef(null);
  const playerRef = useRef<videojs.Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        liveui: true,
        techOrder: ["html5"],
      });

      playerRef.current.src({
        src: playbackUrl,
        type: "application/x-mpegURL",
      });

      playerRef.current.on("error", () => {
        setError("Erro ao carregar a transmissão.");
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [playbackUrl]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <div data-vjs-player className="w-full max-w-2xl">
        <video ref={videoRef} className="video-js vjs-default-skin w-full" />
      </div>
    </div>
  );
}
