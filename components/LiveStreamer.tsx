"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { createIvsChannel } from "@/lib/createIvsChannel";

interface LiveStreamerProps {
  userId: string;
}

export default function LiveStreamer({ userId }: LiveStreamerProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [ingestEndpoint, setIngestEndpoint] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 🔍 Obtém os dados da transmissão ao iniciar
  useEffect(() => {
    async function setupStream() {
      try {
        const ivsChannel = await createIvsChannel(userId);
        if (!ivsChannel) throw new Error("Erro ao criar canal IVS");

        setStreamKey(ivsChannel.streamKey);
        setIngestEndpoint(ivsChannel.ingestEndpoint);

        console.log("🎥 Canal IVS criado:", ivsChannel);
      } catch (error) {
        console.error("Erro ao configurar a transmissão:", error);
      }
    }

    setupStream();
  }, [userId]);

  // 🎥 Captura a câmera/microfone do usuário
  const startStreaming = async () => {
    if (!streamKey || !ingestEndpoint) {
      console.error("⚠️ StreamKey ou Ingest Endpoint não encontrados.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      console.log("🎥 Câmera e microfone ativados!");

      // 🔥 Enviar o stream para o servidor IVS/WebRTC
      await sendStreamToServer(stream);
      setIsStreaming(true);
    } catch (error) {
      console.error("❌ Erro ao acessar câmera/microfone:", error);
    }
  };

  // 🛑 Para a transmissão ao vivo
  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsStreaming(false);
      console.log("🛑 Transmissão encerrada.");
    }
  };

  // 🔗 Simulando envio para o IVS/WebRTC (substitua com lógica real)
  const sendStreamToServer = async (stream: MediaStream) => {
    console.log("📡 Enviando stream para:", ingestEndpoint);
    // Aqui você pode conectar com WebRTC ou Amazon IVS Web Broadcast SDK
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">🎬 Live Streaming</h1>

      <video ref={videoRef} className="w-full max-w-2xl border rounded" autoPlay muted />

      <div className="mt-4 flex gap-4">
        {!isStreaming ? (
          <Button onClick={startStreaming} disabled={!streamKey || !ingestEndpoint}>
            Iniciar Transmissão
          </Button>
        ) : (
          <Button onClick={stopStreaming} className="bg-red-500 hover:bg-red-600">
            Parar Transmissão
          </Button>
        )}
      </div>
    </div>
  );
}
/*


"use client";

import { useEffect, useState, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const TOKEN_SERVER = "/api/agora/token";

export default function LiveStreamer() {
  const { data: session, status } = useSession();
  const [client, setClient] = useState<ReturnType<typeof AgoraRTC.createClient> | null>(null);
  const [tracks, setTracks] = useState<{ audioTrack: any; videoTrack: any } | null>(null);
  const [joined, setJoined] = useState(false);

  // ⚡ Redireciona para login se usuário não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  // 🎥 Função para iniciar a transmissão ao vivo
  const startLiveStream = useCallback(async () => {
    if (!session?.user?.id || client) return;

    const influencerId = session.user.id; // 🔥 Obtendo `userId`

    const rtcClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    setClient(rtcClient);

    try {
      // Obtém o token para ingressar na transmissão
      const tokenRes = await fetch(`${TOKEN_SERVER}?channel=${influencerId}`);
      const { token } = await tokenRes.json();

      await rtcClient.join(APP_ID, influencerId, token, null);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setTracks({ audioTrack, videoTrack });

      await rtcClient.publish([audioTrack, videoTrack]);
      setJoined(true);
      console.log("🎥 Transmissão ao vivo iniciada!");
    } catch (error) {
      console.error("❌ Erro ao iniciar a transmissão:", error);
    }
  }, [session?.user?.id, client]);

  // 🛑 Função para parar a transmissão ao vivo
  const stopLiveStream = useCallback(() => {
    if (!client || !tracks) return;

    tracks.audioTrack.stop();
    tracks.audioTrack.close();
    tracks.videoTrack.stop();
    tracks.videoTrack.close();

    client.leave();
    setTracks(null);
    setClient(null);
    setJoined(false);

    console.log("🛑 Transmissão encerrada!");
  }, [client, tracks]);

  // 🏗️ Efeito para iniciar automaticamente a transmissão quando usuário logar
  useEffect(() => {
    if (session?.user?.id) startLiveStream();

    return () => {
      stopLiveStream();
    };
  }, [session?.user?.id, startLiveStream, stopLiveStream]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">🎬 Transmissão Ao Vivo</h1>
      <div id="agora-container" className="w-full max-w-2xl border rounded"></div>

      {joined ? (
        <Button className="bg-red-500 hover:bg-red-600" onClick={stopLiveStream}>
          Parar Transmissão
        </Button>
      ) : (
        <Button onClick={startLiveStream}>Iniciar Transmissão</Button>
      )}
    </div>
  );
}
*/