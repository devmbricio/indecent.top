"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { registerIVSQualityPlugin, registerIVSTech } from "amazon-ivs-player";

interface VideoJSProps {
  options: any;
  onReady: any;
}

export const VideoJS = ({ options, onReady }: VideoJSProps) => {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!playerRef.current) {
      registerIVSTech(videojs, {
        wasmBinary: "/amazon-ivs-wasmworker.min.wasm",
        wasmWorker: "/amazon-ivs-wasmworker.min.js",
      });
      registerIVSQualityPlugin(videojs);

      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        techOrder: ["AmazonIVS"],
        ...options,
      }, () => {
        onReady && onReady(player);
      }));

      player.autoplay(options?.autoplay);
      player.src(options?.sources);
    }
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
