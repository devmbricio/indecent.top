"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function WatchReelsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/stream/getActivities");
        const data = await response.json();
        if (data.activities.length > 0) {
          setVideoUrl(data.activities[0].object); // Definindo o URL do vídeo da transmissão
        } else {
          router.push("/no-transmission"); // Redireciona se não houver transmissão
        }
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };
    fetchActivities();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Assistindo à Transmissão</h1>
      {videoUrl ? (
        <video src={videoUrl} className="w-full h-auto mt-5" controls autoPlay />
      ) : (
        <p>Nenhuma transmissão ao vivo disponível.</p>
      )}
    </div>
  );
}
