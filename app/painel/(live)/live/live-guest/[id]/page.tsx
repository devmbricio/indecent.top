"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import Picker from "emoji-picker-react";

export default function StartGuestLivePage() {
  const router = useRouter();
  const { id: inviteCode } = useParams(); // Pega o inviteCode da URL
  const { data: session, status } = useSession();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [streamKey, setStreamKey] = useState<string>("");
  const [ingestEndpoint, setIngestEndpoint] = useState<string>("");
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Ajusta a altura do chat para ser igual à do canvas
    function adjustChatHeight() {
      if (previewCanvasRef.current && chatContainerRef.current) {
        const canvasHeight = previewCanvasRef.current.clientHeight;
        chatContainerRef.current.style.height = `${canvasHeight}px`;
      }
    }

    adjustChatHeight();
    window.addEventListener("resize", adjustChatHeight);
    return () => window.removeEventListener("resize", adjustChatHeight);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const fetchLiveDetails = async () => {
      try {
        const response = await fetch(`/api/live/details?inviteCode=${inviteCode}`);
        const data = await response.json();
        if (data?.streamKey && data?.ingestEndpoint) {
          setStreamKey(data.streamKey);
          setIngestEndpoint(data.ingestEndpoint);
        } else {
          alert("Live não encontrada.");
          router.push("/live/live-guest");
        }
      } catch (error) {
        console.error("❌ Erro ao buscar detalhes da live:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveDetails();
  }, [session, status, router, inviteCode]);

  const startLiveStream = async () => {
    try {
      const isSmallScreen = window.innerWidth < 768;
      const aspectRatio = isSmallScreen ? 9 / 16 : 16 / 9;
      const width = isSmallScreen ? 720 : 1280;
      const height = isSmallScreen ? 1280 : 720;

      const userStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width,
          height,
          aspectRatio,
          frameRate: { ideal: 30, max: 60 },
        },
        audio: true,
      });

      const streamConfig = isSmallScreen ? IVSBroadcastClient.BASIC_PORTRAIT : BASIC_LANDSCAPE;
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig,
        logLevel: LogLevels.INFO,
      });

      ivsClient.addVideoInputDevice(userStream, "camera1", { index: 0 });
      ivsClient.addAudioInputDevice(userStream, "mic1");

      if (previewCanvasRef.current) {
        ivsClient.attachPreview(previewCanvasRef.current);
      }

      setClient(ivsClient);
      await ivsClient.startBroadcast(streamKey);
    } catch (error) {
      console.error("❌ Erro ao iniciar a transmissão:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) client.stopBroadcast();
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const addEmoji = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  if (loading) return <p>Carregando detalhes da live...</p>;

  return (
    <div className="relative flex flex-col items-center w-full h-screen">
      <canvas
        ref={previewCanvasRef}
        className="w-full max-w-3xl rounded-lg border border-gray-300"
        style={{ aspectRatio: "16 / 9", width: "100%", maxHeight: "90vh" }}
      ></canvas>

      <div
        ref={chatContainerRef}
        className="absolute top-0 right-0 w-64 p-2 bg-opacity-60 rounded-lg text-white flex flex-col h-full"
      >
        <h3 className="text-md text-green-300 font-bold text-right">Chat</h3>
        <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto flex-grow">
          {chatMessages.map((msg, index) => (
            <p key={index} className="text-right text-sm p-1">{msg}</p>
          ))}
        </div>
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full p-2 bg-gray-800 rounded text-white"
            placeholder="Digite sua mensagem..."
          />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        </div>
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute z-10">
            <Picker onEmojiClick={addEmoji} />
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button onClick={startLiveStream} className="px-4 py-2 bg-green-500 text-white rounded">
          🎥 Iniciar Transmissão
        </button>
        <button onClick={stopLiveStream} className="px-4 py-2 bg-red-500 text-white rounded">
          ⏹️ Encerrar Transmissão
        </button>
      </div>
    </div>
  );
}
