"use client";

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

type StoryVideoProps = {
  videoUrl: string;
  thumbnailUrl: string;
};

const StoryVideo: React.FC<StoryVideoProps> = ({ videoUrl, thumbnailUrl }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  // Obter URL assinada
  useEffect(() => {
    async function fetchSignedUrl() {
      try {
        const response = await fetch(`/api/stories?key=${videoUrl}`);
        const data = await response.json();
        if (data.url) {
          setSignedUrl(data.url);
        }
      } catch (error) {
        console.error("Erro ao buscar URL assinada:", error);
      }
    }

    fetchSignedUrl();
  }, [videoUrl]);

  return (
    <div className="relative w-20 h-20 md:w-40 md:h-40 overflow-hidden cursor-pointer border border-gray-200 rounded-md">
      {signedUrl ? (
        <ReactPlayer
          url={signedUrl}
          controls
          playing={false}
          light={thumbnailUrl}
          width="100%"
          height="100%"
          config={{
            file: {
              attributes: {
                preload: "auto",
              },
            },
          }}
        />
      ) : (
        <div className="flex justify-center items-center h-full bg-gray-100">
          <p>Carregando...</p>
        </div>
      )}
    </div>
  );
};

export default StoryVideo;

