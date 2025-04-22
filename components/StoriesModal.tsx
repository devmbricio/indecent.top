"use client";

import { useEffect, useRef } from "react";

type ModalProps = {
  onClose: () => void;
  videoUrl: string;
};

export default function StoriesModal({ onClose, videoUrl }: ModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  const handleVideoError = () => {
    console.error(`Erro ao carregar o vídeo: ${videoUrl}`);
    alert("Erro ao carregar o vídeo. Verifique sua conexão ou tente novamente mais tarde.");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:bg-gray-500 rounded-full p-2"
        >
          ✕
        </button>
        <div className="relative">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-w-full max-h-[80vh] rounded-lg"
              autoPlay
              playsInline
              controls
              onError={handleVideoError}
            />
          ) : (
            <p className="text-center text-red-500">Erro: URL do vídeo inválida.</p>
          )}
        </div>
      </div>
    </div>
  );
}


/*


"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";

type ModalProps = {
  onClose: () => void;
  videoUrl: string;
};

export default function StoriesModal({ onClose, videoUrl }: ModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#ddc897] rounded-lg p-1 relative max-w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:bg-gray-500 rounded-full p-2"
        >
          ✕
        </button>
        <div className="relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-full max-h-[80vh] rounded-lg"
            autoPlay
            playsInline
            controls={false}
          />
        </div>
      </div>
    </div>
  );
}
*/


/*


import { MouseEvent, useEffect, useRef, useState } from "react";

type ModalProps = {
  onClose: () => void;
  videoUrl: string;
};

export default function StoriesModal({ onClose, videoUrl }: ModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleVideoEnd = () => {
      onClose();
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const currentProgress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("ended", handleVideoEnd);
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleVideoEnd);
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime =
        (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#ddc897] rounded-lg p-1 relative max-w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#ddc897] text-black hover:bg-gray-300 rounded-full p-2"
        >
          ✕
        </button>
        <div className="relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-full max-h-[80vh] rounded-lg"
            autoPlay
            playsInline
            controls={false} // Remove os controles padrão
          />
 
          <div className="absolute bottom-2 left-2 right-2 flex flex-col items-center space-y-2">
           
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              className="w-full appearance-none bg-[#cdb03c] rounded h-2 cursor-pointer"
            />
   
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue="1"
              onChange={(e) =>
                videoRef.current &&
                (videoRef.current.volume = parseFloat(e.target.value))
              }
              className="w-full appearance-none bg-[#cdb03c] rounded h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
 */
/*



import { ReactNode, MouseEvent } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

export default function StoriesModal({ onClose, children }: ModalProps) {
  // Função para lidar com cliques no fundo
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick} // Adiciona o evento de clique no fundo
    >
      <div className="bg-[#ddc897] rounded-lg p-1 relative">
     
        {children}
      </div>
    </div>
  );
}
*/
/*


import { ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

export default function StoriesModal({ onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#ddc897] rounded-lg p-1 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#ddc897] hover:bg-gray-600 rounded-full p-4"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
*/