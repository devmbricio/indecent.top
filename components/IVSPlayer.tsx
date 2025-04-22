
"use client";

import VideoJS from "./VideoJS";
import videojs from "video.js";
import { useCallback, useRef } from "react";
import { registerIVSQualityPlugin } from "amazon-ivs-player";

interface IVSPlayerProps {
  playbackURL: string;
}

const IVSPlayer = ({ playbackURL }: IVSPlayerProps) => {
  const playerRef = useRef<any>(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{ src: playbackURL, type: "application/x-mpegURL" }],
  };

  const muteHandler = () => {
    if (!playerRef.current) return;
    const isMuted = playerRef.current.muted();
    playerRef.current.muted(!isMuted);
    document.getElementById("audioControl")!.innerText = isMuted ? "Mute" : "Unmute";
  };

  const handlePlayerReady = useCallback((player: any) => {
    playerRef.current = player;
    registerIVSQualityPlugin(videojs);
    player.enableIVSQualityPlugin();
  }, []);

  return (
    <div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div className="w-full flex justify-center items-center">
        <button id="audioControl" onClick={muteHandler} className="py-2.5 px-5 bg-blue-500 text-white rounded my-2">
          Unmute
        </button>
      </div>
    </div>
  );
};

export default IVSPlayer;
