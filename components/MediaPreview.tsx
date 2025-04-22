'use client';

import { useState } from 'react';
import ImageWithErrorHandler from './ImageWithErrorHandler';

const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg'];

function isVideo(url: string) {
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

export default function MediaPreview({ url, alt }: { url: string; alt: string }) {
  const [showVideo, setShowVideo] = useState(false);

  if (!isVideo(url)) {
    return (
      <ImageWithErrorHandler
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        unoptimized
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      {showVideo ? (
        <video
          src={url}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <video
            src={url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            playsInline
            onLoadedMetadata={(e) => {
              (e.target as HTMLVideoElement).currentTime = 0.1;
            }}
          />
          <button
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 flex items-center justify-center text-5xl text-white bg-black/30 hover:bg-black/50 transition"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}
