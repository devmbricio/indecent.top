"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { generateFileUrl } from "@/lib/s3-video-utils"; // Importa a função generateFileUrl

export default function CreateStoryPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para login se o usuário não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Função para lidar com a seleção de vídeo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("video/")) {
        alert("Por favor, selecione um arquivo de vídeo.");
        return;
      }

      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file)); // Gera a URL para pré-visualização
    }
  };

  // Função para fazer o upload do vídeo
  const handleUpload = async () => {
    if (!session?.user) {
      alert("Usuário não está logado.");
      return;
    }

    if (!videoFile) {
      alert("Selecione um vídeo.");
      return;
    }

    setLoading(true);

    try {
      // Solicita a URL pré-assinada para o S3
      const { data: { uploadUrl } } = await axios.post("/api/stories/upload", {
        videoName: videoFile.name,
        contentType: videoFile.type,
      });

      // Faz o upload do vídeo diretamente para o S3 usando a URL pré-assinada
      await axios.put(uploadUrl, videoFile, {
        headers: {
          "Content-Type": videoFile.type,
        },
      });

      // Após o upload, gerar a URL pública do vídeo no CloudFront
      const publicUrl = generateFileUrl(videoFile.name); // Gera a URL pública com CloudFront

      // Salva o Story no banco de dados
      const expiresIn = 24; // Defina o tempo de expiração (em horas)
      const response = await axios.post("/api/stories/save", {
        videoUrl: publicUrl,
        userId: session.user.id,
        expiresIn,
      });

      alert("Vídeo enviado com sucesso!");
      router.push("/painel");

    } catch (error) {
      console.error("Erro no processo de upload:", error);
      alert("Erro ao enviar o vídeo.");
    } finally {
      setLoading(false);
    }
  };

  // Pausa o vídeo quando a aba perde o foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (status === "unauthenticated") return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Story</h1>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4 bg-gray-600"
      />

      {videoPreviewUrl && (
        <div className="relative mb-4 flex justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Pré-visualização:</h2>
          <video
            ref={videoRef}
            src={videoPreviewUrl}
            controls
            playsInline
            className="rounded-lg border border-gray-300"
            style={{
              maxHeight: "80vh",
              objectFit: "contain",
              width: "100%",
            }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !videoFile || !session?.user}
        className={`py-2 px-4 rounded ${loading ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-gray-300 hover:bg-blue-600"}`}
      >
        {loading ? "Enviando..." : "Publicar Story"}
      </button>
    </div>
  );
}



/* salva o vido no db mas nao gera o db
"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { generateFileUrl } from "@/lib/s3-video-utils"; // Importa a função generateFileUrl

export default function CreateStoryPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para login se o usuário não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Função para lidar com a seleção de vídeo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("video/")) {
        alert("Por favor, selecione um arquivo de vídeo.");
        return;
      }

      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file)); // Gera a URL para pré-visualização
    }
  };

  // Função para fazer o upload do vídeo
  const handleUpload = async () => {
    if (!session?.user) {
      alert("Usuário não está logado.");
      return;
    }

    if (!videoFile) {
      alert("Selecione um vídeo.");
      return;
    }

    setLoading(true);

    try {
      // Solicita a URL pré-assinada para o S3
      const { data: { uploadUrl } } = await axios.post("/api/stories/upload", {
        videoName: videoFile.name,
        contentType: videoFile.type,
      });

      // Faz o upload do vídeo diretamente para o S3 usando a URL pré-assinada
      await axios.put(uploadUrl, videoFile, {
        headers: {
          "Content-Type": videoFile.type,
        },
      });

      // Após o upload, gerar a URL pública do vídeo no CloudFront
      const publicUrl = generateFileUrl(videoFile.name); // Gera a URL pública com CloudFront

      // Salvar a URL no banco de dados (via backend ou outra ação)
      alert("Vídeo enviado com sucesso!");
      router.push("/painel");

    } catch (error) {
      console.error("Erro no processo de upload:", error);
      alert("Erro ao enviar o vídeo.");
    } finally {
      setLoading(false);
    }
  };

  // Pausa o vídeo quando a aba perde o foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (status === "unauthenticated") return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Story</h1>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4 bg-gray-600"
      />

      {videoPreviewUrl && (
        <div className="relative mb-4 flex justify-center items-center">
          <h2 className="text-lg font-semibold mb-2">Pré-visualização:</h2>
          <video
            ref={videoRef}
            src={videoPreviewUrl}
            controls
            playsInline
            className="rounded-lg border border-gray-300"
            style={{
              maxHeight: "80vh",
              objectFit: "contain",
              width: "100%",
            }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !videoFile || !session?.user}
        className={`py-2 px-4 rounded ${loading ? "bg-gray-500 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-gray-300 hover:bg-blue-600"}`}
      >
        {loading ? "Enviando..." : "Publicar Story"}
      </button>
    </div>
  );
}
*/