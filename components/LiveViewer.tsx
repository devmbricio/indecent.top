"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LiveViewerProps {
  influencerId: string;
  userId: string; // ID do usuário logado
}

export default function LiveViewer({ influencerId, userId }: LiveViewerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [message, setMessage] = useState("");

  // 🚀 Busca as mensagens a cada 5 segundos (Polling)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${influencerId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Erro ao buscar mensagens", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(interval);
  }, [influencerId]);

  // 🚀 Busca a live da API
  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const res = await fetch(`/api/live/${influencerId}`);
        const data = await res.json();
        setStreamUrl(data.playbackUrl);
      } catch (err) {
        console.error("Erro ao buscar live", err);
      }
    };

    fetchLiveStream();
  }, [influencerId]);

  // 🔥 Envia mensagem para o servidor
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ influencerId, userId, text: message }),
      });

      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold">Assistindo à Live</h1>

      {streamUrl ? (
        <video controls autoPlay className="w-full max-w-2xl">
          <source src={streamUrl} type="application/x-mpegURL" />
          Seu navegador não suporta a reprodução de vídeo.
        </video>
      ) : (
        <p>Carregando transmissão...</p>
      )}

      <div className="mt-6 w-full max-w-md border p-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="h-32 overflow-y-auto border p-2">
          {messages.map((msg) => (
            <p key={msg.id}>{msg.text}</p>
          ))}
        </div>
        <div className="mt-2 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border p-2"
          />
          <Button onClick={sendMessage} className="ml-2 px-4 py-2 bg-green-500 text-white">
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
