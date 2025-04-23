"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
};

export default function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const current = videoRef.current;

    const handlePlay = () => {
      document.querySelectorAll("video").forEach((video) => {
        if (video !== current) video.pause();
      });
      setIsPlaying(true);
    };

    const handlePause = () => setIsPlaying(false);

    current?.addEventListener("play", handlePlay);
    current?.addEventListener("pause", handlePause);

    return () => {
      current?.removeEventListener("play", handlePlay);
      current?.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // impede propagação para o link pai
    e.preventDefault();  // evita redirecionamento
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        playsInline
        className="w-full h-full object-cover"
        preload="metadata"
      />
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-[#ddc897] "
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}


