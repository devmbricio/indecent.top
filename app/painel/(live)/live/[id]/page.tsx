"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import Picker from "emoji-picker-react";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null); // Ref para o Emoji Picker
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);


// Ajusta a altura do chat para ser sempre igual à do canvas
useEffect(() => {
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

// Rola automaticamente para mostrar a última mensagem no topo
useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [chatMessages]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/compras");
      return;
    }
    if (session.user.influencerRole === "INFLUENCER") {
      setIsInfluencer(true);
      setLoading(false);
    } else {
      setShowMessage(true);
      setTimeout(() => router.push("/compras"), 5000);
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!session?.user?.id || !isInfluencer) return;
      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        const data = await response.json();
        if (!data.error) {
          setStreamKey(data.streamKey);
          setIngestEndpoint(data.ingestEndpoint);
        }
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };
    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [session, isInfluencer]);

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
          frameRate: { ideal: 30, max: 60 }, // Ajuste para fluidez
        },
        audio: true,
      });
  
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
  
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
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };
  

  const stopLiveStream = () => {
    if (client) client.stopBroadcast();
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage("");
      setShowEmojiPicker(false); // Fecha ao enviar
    }
  };

  const addEmoji = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Fecha o picker após selecionar
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [chatMessages]);

  // Fecha o Emoji Picker ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) && // Verifica se o clique foi fora do Picker
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) // Permite interação com o campo de entrada  
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Fecha ao pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (loading) return <p>Carregando...</p>;

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-blue-500 underline">Verificar</a>.</p>
      </div>
    );
  }
  

  return (
    <div className="relative flex flex-col items-center w-full h-screen">
      {/* Vídeo/Canvas com altura dinâmica */}
      <canvas
        ref={previewCanvasRef}
        className="w-full max-w-3xl rounded-lg border border-[#ddc897]"
        style={{
          aspectRatio: window.innerWidth < 768 ? "9 / 16" : "16 / 9",
          width: "100%",
          maxHeight: "90vh"
        }}
      ></canvas>
  
      {/* Chat fixo com altura igual ao canvas */}
      <div ref={chatContainerRef} className="absolute items-end justify-end top-0 right-0 w-64 p-2 bg-opacity-60 rounded-lg text-white flex flex-col h-[100%] md:max-h-[60%] max-h-[90%]"
         >
        <h3 className="text-md text-green-300 font-bold text-right">Chat</h3>
  
        {/* SOMENTE AS MENSAGENS ROLAM */}
        <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto flex-grow"
          style={{ maxHeight: "calc(100% - 70px)" }}> {/* Garante que o input não role */}
          {chatMessages.map((msg, index) => (
            <p key={index} className="text-right text-sm p-1">{msg}</p>
          ))}
        </div>
  
        {/* Input e botão fixos na base */}
        <div className=" rounded-b-lg w-[100%] md:max-w-[60%] max-w-[60%] right-0">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-1 opacity-50 bg-gray-500 rounded text-white"
              placeholder="Digite sua mensagem..."
            />
            <button className="absolute right-2 top-1 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
          </div>
  
          <button className="w-full mt-1  opacity-50 bg-blue-400 rounded text-white" onClick={sendMessage}>Enviar</button>
        </div>
  
        {/* Emoji Picker posicionado corretamente */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute right-2 md:top-[30%] top-[50%] z-10">
            <Picker onEmojiClick={addEmoji} style={{ backgroundColor: '#4B5563', borderRadius: '8px', accentColor: '#4B5563', color: '#4B5563',  transform: 'scale(0.5)',  right: '0', transformOrigin: 'top right'  }} />
          </div>
        )}
      </div>
  
      <div className="flex gap-4 mt-4">
        <button className="opacity-50 px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold" onClick={startLiveStream}>
          🎥 Iniciar Transmissão
        </button>
        <button className="opacity-50 px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold" onClick={stopLiveStream}>
          ⏹️ Encerrar Transmissão
        </button>
      </div>
    </div>
  );
  
}

/*
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import Picker from "emoji-picker-react";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/compras");
      return;
    }
    if (session.user.influencerRole === "INFLUENCER") {
      setIsInfluencer(true);
      setLoading(false);
    } else {
      setShowMessage(true);
      setTimeout(() => router.push("/compras"), 5000);
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    const adjustChatHeight = () => {
      if (previewCanvasRef.current && chatContainerRef.current) {
        const canvasHeight = previewCanvasRef.current.clientHeight;
        chatContainerRef.current.style.height = `${canvasHeight}px`;
      }
    };

    adjustChatHeight();
    window.addEventListener("resize", adjustChatHeight);
    return () => window.removeEventListener("resize", adjustChatHeight);
  }, []);

  const startLiveStream = async () => {
    try {
      const isSmallScreen = window.innerWidth < 768;
      const aspectRatio = isSmallScreen ? 9 / 16 : 16 / 9;
      const width = isSmallScreen ? 720 : 1280;
      const height = isSmallScreen ? 1280 : 720;

      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width, height, aspectRatio, frameRate: { ideal: 30, max: 60 } },
        audio: true,
      });

      if (videoRef.current) videoRef.current.srcObject = userStream;

      const streamConfig = isSmallScreen ? IVSBroadcastClient.BASIC_PORTRAIT : BASIC_LANDSCAPE;
      const ivsClient = IVSBroadcastClient.create({ ingestEndpoint, streamConfig, logLevel: LogLevels.INFO });

      ivsClient.addVideoInputDevice(userStream, "camera1", { index: 0 });
      ivsClient.addAudioInputDevice(userStream, "mic1");

      if (previewCanvasRef.current) ivsClient.attachPreview(previewCanvasRef.current);

      setClient(ivsClient);
      await ivsClient.startBroadcast(streamKey);
    } catch (error) {
      console.error("❌ Erro ao iniciar a live:", error);
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

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = 0;
  }, [chatMessages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-blue-500 underline">Verificar</a>.</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full h-screen">
      <canvas
        ref={previewCanvasRef}
        className="w-full max-w-3xl rounded-lg border border-[#ddc897]"
        style={{ aspectRatio: window.innerWidth < 768 ? "9 / 16" : "16 / 9", width: "100%", maxHeight: "90vh" }}
      ></canvas>

  
      <div ref={chatContainerRef} className="absolute top-0 right-0 w-64 p-2 bg-opacity-60 rounded-lg overflow-hidden text-white flex flex-col">
        <h3 className="text-md text-green-300 font-bold text-right">Chat</h3>
        <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto flex-grow">
          {chatMessages.map((msg, index) => (
            <p key={index} className="text-right text-sm p-1">{msg}</p>
          ))}
        </div>

   
        <div className="relative mt-auto">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-1 mt-2 bg-gray-700 rounded text-white"
            placeholder="Digite sua mensagem..."
          />
          <button className="absolute right-2 top-3 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        </div>

       
         <div></div>
        <button className="opacity-50 w-full mt-1 bg-blue-400 rounded text-white" onClick={sendMessage}>Enviar</button>

        {showEmojiPicker && ( <div ref={emojiPickerRef} > <Picker width={"80%"} onEmojiClick={addEmoji} style={{ backgroundColor: '#4B5563', borderRadius: '8px', accentColor: '#4B5563', color: '#4B5563',  transform: 'scale(0.7)',  right: '0', transformOrigin: 'top right' }} />  </div>)} 

      </div>

      <div className="flex gap-4 mt-4">
        <button className="opacity-50 px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold" onClick={startLiveStream}>🎥 Iniciar Transmissão</button>
        <button className="opacity-50 px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold" onClick={stopLiveStream}>⏹️ Encerrar Transmissão</button>
      </div>
    </div>
  );
}
*/

/* otimo, testar todas as funcionalidades antes de producar
"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import Picker from "emoji-picker-react";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null); // Ref para o Emoji Picker
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/compras");
      return;
    }
    if (session.user.influencerRole === "INFLUENCER") {
      setIsInfluencer(true);
      setLoading(false);
    } else {
      setShowMessage(true);
      setTimeout(() => router.push("/compras"), 5000);
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!session?.user?.id || !isInfluencer) return;
      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        const data = await response.json();
        if (!data.error) {
          setStreamKey(data.streamKey);
          setIngestEndpoint(data.ingestEndpoint);
        }
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };
    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [session, isInfluencer]);

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
          frameRate: { ideal: 30, max: 60 }, // Ajuste para fluidez
        },
        audio: true,
      });
  
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
  
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
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };
  

  const stopLiveStream = () => {
    if (client) client.stopBroadcast();
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage("");
      setShowEmojiPicker(false); // Fecha ao enviar
    }
  };

  const addEmoji = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Fecha o picker após selecionar
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [chatMessages]);

  // Fecha o Emoji Picker ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) && // Verifica se o clique foi fora do Picker
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) // Permite interação com o campo de entrada  
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Fecha ao pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (loading) return <p>Carregando...</p>;

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-blue-500 underline">Verificar</a>.</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full h-screen">
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]" style={{
    aspectRatio: window.innerWidth < 768 ? "9 / 16" : "16 / 9",
    width: "100%",
    maxHeight: "90vh",
  }} ></canvas>
      <div className="absolute top-0 right-0 h-full w-62 p-2  bg-opacity-60 rounded-lg overflow-hidden text-white ">
        <h3 className="text-md text-green-300 font-bold text-right">Chat</h3>
        <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto h-72">
          {chatMessages.map((msg, index) => (
            <p key={index} className="text-right text-sm p-1">{msg}</p>
          ))}
        </div>
        <div className="relative">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="opacity-50 w-full p-1 mt-2 bg-gray-700 rounded text-white" placeholder="Digite sua mensagem..." />
          <button className="absolute right-2 top-3 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        </div>
        {showEmojiPicker && <Picker width={"80%"} onEmojiClick={addEmoji} style={{ backgroundColor: '#4B5563', borderRadius: '8px', accentColor: '#4B5563', color: '#4B5563',  transform: 'scale(0.7)',  right: '0', transformOrigin: 'top right' }} />}

        <button className="opacity-50  w-full pt-0 mt-1 bg-blue-400 rounded text-white" onClick={sendMessage}>Enviar</button>
      </div>
      <div className="flex gap-4 mt-4">
        <button className="opacity-50 px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold" onClick={startLiveStream}>🎥 Iniciar Transmissão</button>
        <button className="opacity-50 px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold" onClick={stopLiveStream}>⏹️ Encerrar Transmissão</button>
      </div>
    </div>
  );
}
*/




/*
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import Picker from "emoji-picker-react";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Espera a sessão carregar

    if (!session?.user) {
      console.warn("⚠️ Sessão não encontrada, redirecionando...");
      router.push("/compras");
      return;
    }

    console.log("🔍 Sessão carregada:", session);

    if (session.user.influencerRole === "INFLUENCER") {
      console.log("✅ Usuário é INFLUENCER, concedendo acesso.");
      setIsInfluencer(true);
      setLoading(false);
    } else {
      console.log("❌ Usuário não é INFLUENCER. Redirecionando...");
      setShowMessage(true);
      setTimeout(() => router.push("/compras"), 5000);
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!session?.user?.id || !isInfluencer) return;
      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        const data = await response.json();
        if (data.error) {
          console.error("❌ Erro ao criar live:", data.error);
          return;
        }
        setStreamKey(data.streamKey);
        setIngestEndpoint(data.ingestEndpoint);
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };
    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [session, isInfluencer]);

  const startLiveStream = async () => {
    try {
      const isSmallScreen = window.innerWidth < 768;
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: isSmallScreen ? 9 / 16 : 16 / 9, width: isSmallScreen ? 720 : 1280, height: isSmallScreen ? 1280 : 720 },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig: BASIC_LANDSCAPE,
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
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) {
      client.stopBroadcast();
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage("");
    }
  };

  const addEmoji = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [chatMessages]);


  if (loading) return <p>Carregando...</p>;

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-blue-500 underline">Verificar</a>.</p>
        <p>Se já atingiu, solicite a atualização pelo Instagram:</p>
        <a href="https://www.instagram.com/top.indecent" className="text-blue-500 underline">@top.indecent</a>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full h-screen">
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]"></canvas>
      <div className="absolute top-0 right-0 h-full w-62 p-2  bg-opacity-60 rounded-lg overflow-hidden text-white">
        <h3 className="text-md text-green-300 font-bold text-right">Chat</h3>
        <div ref={chatRef} className="flex flex-col-reverse overflow-y-auto h-72">
          {chatMessages.map((msg, index) => (
            <p key={index} className="text-right text-sm p-1">{msg}</p>
          ))}
        </div>
        <div className="relative">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-1 mt-2 bg-gray-700 rounded text-white" placeholder="Digite sua mensagem..." />
          <button className="absolute right-2 top-3 text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
        </div>
        {showEmojiPicker && <Picker width={"80%"} onEmojiClick={addEmoji} style={{ backgroundColor: '#4B5563', borderRadius: '8px', accentColor: '#4B5563', color: '#4B5563',  transform: 'scale(0.7)',  right: '0', transformOrigin: 'top right' }} />}

        <button className="w-full pt-0 mt-1 bg-blue-400 rounded text-white" onClick={sendMessage}>Enviar</button>
      </div>
      <div className="flex gap-4 mt-4">
        <button className="px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold" onClick={startLiveStream}>🎥 Iniciar Transmissão</button>
        <button className="px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold" onClick={stopLiveStream}>⏹️ Encerrar Transmissão</button>
      </div>
    </div>
  );
}
*/




/* funcional redirecionando corretamente
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";

export default function StartLivePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Espera a sessão carregar

    if (!session?.user) {
      console.warn("⚠️ Sessão não encontrada, redirecionando...");
      router.push("/compras");
      return;
    }

    console.log("🔍 Sessão carregada:", session);

    if (session.user.influencerRole === "INFLUENCER") {
      console.log("✅ Usuário é INFLUENCER, concedendo acesso.");
      setIsInfluencer(true);
      setLoading(false);
    } else {
      console.log("❌ Usuário não é INFLUENCER. Redirecionando...");
      setShowMessage(true);
      setTimeout(() => router.push("/compras"), 5000);
      setLoading(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!session?.user?.id || !isInfluencer) return;
      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
        const data = await response.json();
        if (data.error) {
          console.error("❌ Erro ao criar live:", data.error);
          return;
        }
        setStreamKey(data.streamKey);
        setIngestEndpoint(data.ingestEndpoint);
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };
    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [session, isInfluencer]);

  const startLiveStream = async () => {
    try {
      const isSmallScreen = window.innerWidth < 768;
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: isSmallScreen ? 9 / 16 : 16 / 9, width: isSmallScreen ? 720 : 1280, height: isSmallScreen ? 1280 : 720 },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig: BASIC_LANDSCAPE,
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
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) {
      client.stopBroadcast();
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage("");
    }
  };

  if (loading) return <p>Carregando...</p>;

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-blue-500 underline">Verificar</a>.</p>
        <p>Se já atingiu, solicite a atualização pelo Instagram:</p>
        <a href="https://www.instagram.com/top.indecent" className="text-blue-500 underline">@top.indecent</a>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]"></canvas>
      <div className="absolute top-6 right-0 bg-transparent bg-opacity-50 p-0 rounded-lg w-62 max-h-156 overflow-y-auto text-white border border-[#ddc897]">
        <h3 className="flex text-md text-green-300 font-bold items-end justify-end pr-1">Chat</h3>
        <div className="overflow-y-auto h-64">{chatMessages.map((msg, index) => (<p key={index}>{msg}</p>))}</div>
        <div className="p-1">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-1 mt-0 bg-gray-600 rounded" placeholder="Digite sua mensagem..." />
        </div>
        <div className="p-1">
        <button className="w-full mt-1 p-0 bg-blue-400 rounded" onClick={sendMessage}>Enviar</button>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button className="px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold" onClick={startLiveStream}>🎥 Iniciar Transmissão</button>
        <button className="px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold" onClick={stopLiveStream}>⏹️ Encerrar Transmissão</button>
      </div>
    </div>
  );
}
*/




/* funcional com 
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import { checkUserRole } from "@/actions/getInfluencerRole";

export default function StartLivePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyUserRole = async () => {
      if (!userId) return;
      try {
        const { role } = await checkUserRole(userId);
        if (role === "INFLUENCER") {
          setIsInfluencer(true);
        } else {
          setShowMessage(true);
          setTimeout(() => router.push("/compras"), 10000);
        }
      } catch (error) {
        console.error("❌ Erro ao verificar o status do usuário:", error);
        router.push("/compras");
      } finally {
        setLoading(false);
      }
    };
    verifyUserRole();
  }, [userId, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!userId || !isInfluencer) return;
      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        if (data.error) {
          console.error("❌ Erro ao criar live:", data.error);
          return;
        }
        setStreamKey(data.streamKey);
        setIngestEndpoint(data.ingestEndpoint);
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };
    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [userId, isInfluencer]);

  const startLiveStream = async () => {
    try {
      const isSmallScreen = window.innerWidth < 768;
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: isSmallScreen ? 9 / 16 : 16 / 9, width: isSmallScreen ? 720 : 1280, height: isSmallScreen ? 1280 : 720 },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig: BASIC_LANDSCAPE,
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
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) {
      client.stopBroadcast();
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, message]);
      setMessage("");
    }
  };

  if (loading) return <p>Carregando...</p>;

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-blue-500 underline">Verificar</a>.</p>
        <p>Se já atingiu, solicite a atualização pelo Instagram:</p>
        <a href="https://www.instagram.com/top.indecent" className="text-blue-500 underline">@top.indecent</a>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]"></canvas>
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg w-72 max-h-96 overflow-y-auto text-white">
        <h3 className="text-lg font-bold">Chat</h3>
        <div className="overflow-y-auto h-64">{chatMessages.map((msg, index) => (<p key={index}>{msg}</p>))}</div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 mt-2 bg-gray-800 rounded" placeholder="Digite sua mensagem..." />
        <button className="w-full mt-2 p-2 bg-blue-500 rounded" onClick={sendMessage}>Enviar</button>
      </div>
      <div className="flex gap-4 mt-4">
        <button className="px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold" onClick={startLiveStream}>🎥 Iniciar Transmissão</button>
        <button className="px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold" onClick={stopLiveStream}>⏹️ Encerrar Transmissão</button>
      </div>
    </div>
  );
}
*/


/* 100% funcional testar deducao de creditos
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import { checkUserRole } from "@/actions/getInfluencerRole";

export default function StartLivePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const verifyUserRole = async () => {
      if (!userId) return;
      try {
        const { role } = await checkUserRole(userId);
        if (role === "INFLUENCER") {
          setIsInfluencer(true);
        } else {
          setShowMessage(true);
          setTimeout(() => {
          router.push("/compras");
        }, 10000);
        }
      } catch (error) {
        console.error("❌ Erro ao verificar o status do usuário:", error);
        router.push("/compras");
      } finally {
        setLoading(false);
      }
    };
    verifyUserRole();
  }, [userId, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!userId || !isInfluencer) return;

      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.error) {
          console.error("❌ Erro ao criar live:", data.error);
          return;
        }

        setStreamKey(data.streamKey);
        setIngestEndpoint(data.ingestEndpoint);
        console.log("✅ Live criada:", data);
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };

    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [userId, isInfluencer]);

  const startLiveStream = async () => {
    try {
      console.log("🎥 Capturando câmera e microfone...");
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }

      console.log("🚀 Criando cliente IVS...");
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig: BASIC_LANDSCAPE,
        logLevel: LogLevels.INFO,
      });

      console.log("🎥 Adicionando entrada de vídeo e áudio...");
      ivsClient.addVideoInputDevice(userStream, "camera1", { index: 0 });
      ivsClient.addAudioInputDevice(userStream, "mic1");

      if (previewCanvasRef.current) {
        ivsClient.attachPreview(previewCanvasRef.current);
      }

      setClient(ivsClient);

      console.log("📡 Iniciando transmissão para IVS...");
      await ivsClient.startBroadcast(streamKey);
      console.log("✅ Transmissão iniciada!");
    } catch (error) {
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) {
      client.stopBroadcast();
      console.log("⏹️ Transmissão encerrada.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (showMessage) {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <p className="text-red-400 font-semibold">❌ Desculpe, você ainda não alcançou o status de Influencer.</p>
        <p>Verifique os requisitos em <a href="/compras" className="text-[#ddc897] underline">Verificar</a>.</p>
        <p>Se já atingiu, solicite a atualização pelo Instagram:</p>
        <a href="https://www.instagram.com/top.indecent" className="text-[#ddc897] underline">@indecent.top</a>
        <a href="https://www.instagram.com/top.indecent" className="text-[#ddc897] underline">@top.indecent</a>
        <p className="mt-4 text-gray-600">Você será redirecionado para o painel em 8 segundos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]"></canvas>
      <div className="flex gap-4 mt-4">
        <button
          className="px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold"
          onClick={startLiveStream}
        >
          🎥 Iniciar Transmissão
        </button>

        <button
          className="px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold"
          onClick={stopLiveStream}
        >
          ⏹️ Encerrar Transmissão
        </button>
      </div>
    </div>
  );
}
*/

/* redirecionando mas nao mostra mensagem
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";
import { checkUserRole } from "@/actions/getInfluencerRole";

export default function StartLivePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserRole = async () => {
      if (!userId) return;
      try {
        const { role } = await checkUserRole(userId);
        if (role === "INFLUENCER") {
          setIsInfluencer(true);
        } else {
          router.push("/compras");
        }
      } catch (error) {
        console.error("❌ Erro ao verificar o status do usuário:", error);
        router.push("/compras");
      } finally {
        setLoading(false);
      }
    };
    verifyUserRole();
  }, [userId, router]);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!userId || !isInfluencer) return;

      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.error) {
          console.error("❌ Erro ao criar live:", data.error);
          return;
        }

        setStreamKey(data.streamKey);
        setIngestEndpoint(data.ingestEndpoint);
        console.log("✅ Live criada:", data);
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };

    if (isInfluencer) {
      createLiveIfNotExists();
    }
  }, [userId, isInfluencer]);

  const startLiveStream = async () => {
    try {
      console.log("🎥 Capturando câmera e microfone...");
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }

      console.log("🚀 Criando cliente IVS...");
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig: BASIC_LANDSCAPE,
        logLevel: LogLevels.INFO,
      });

      console.log("🎥 Adicionando entrada de vídeo e áudio...");
      ivsClient.addVideoInputDevice(userStream, "camera1", { index: 0 });
      ivsClient.addAudioInputDevice(userStream, "mic1");

      if (previewCanvasRef.current) {
        ivsClient.attachPreview(previewCanvasRef.current);
      }

      setClient(ivsClient);

      console.log("📡 Iniciando transmissão para IVS...");
      await ivsClient.startBroadcast(streamKey);
      console.log("✅ Transmissão iniciada!");
    } catch (error) {
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) {
      client.stopBroadcast();
      console.log("⏹️ Transmissão encerrada.");
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]"></canvas>
      <div className="flex gap-4 mt-4">
        <button
          className="px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold"
          onClick={startLiveStream}
        >
          🎥 Iniciar Transmissão
        </button>

        <button
          className="px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold"
          onClick={stopLiveStream}
        >
          ⏹️ Encerrar Transmissão
        </button>
      </div>
    </div>
  );
}
*/


/* top 100%



"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import IVSBroadcastClient, { BASIC_LANDSCAPE, LogLevels } from "amazon-ivs-web-broadcast";

export default function StartLivePage() {
  const params = useParams();
  const userId = params?.id ? decodeURIComponent(params.id as string) : "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streamKey, setStreamKey] = useState("");
  const [ingestEndpoint, setIngestEndpoint] = useState("");
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const createLiveIfNotExists = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/live/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.error) {
          console.error("❌ Erro ao criar live:", data.error);
          return;
        }

        setStreamKey(data.streamKey);
        setIngestEndpoint(data.ingestEndpoint);
        console.log("✅ Live criada:", data);
      } catch (error) {
        console.error("❌ Erro ao criar a live:", error);
      }
    };

    createLiveIfNotExists();
  }, [userId]);

  const startLiveStream = async () => {
    try {
      console.log("🎥 Capturando câmera e microfone...");
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }

      console.log("🚀 Criando cliente IVS...");
      const ivsClient = IVSBroadcastClient.create({
        ingestEndpoint,
        streamConfig: BASIC_LANDSCAPE,
        logLevel: LogLevels.INFO,
      });

      console.log("🎥 Adicionando entrada de vídeo e áudio...");
      ivsClient.addVideoInputDevice(userStream, "camera1", { index: 0 });
      ivsClient.addAudioInputDevice(userStream, "mic1");

      if (previewCanvasRef.current) {
        ivsClient.attachPreview(previewCanvasRef.current);
      }

      setClient(ivsClient);

      console.log("📡 Iniciando transmissão para IVS...");
      await ivsClient.startBroadcast(streamKey);
      console.log("✅ Transmissão iniciada!");

    } catch (error) {
      console.error("❌ Erro ao iniciar a live:", error);
    }
  };

  const stopLiveStream = () => {
    if (client) {
      client.stopBroadcast();
      console.log("⏹️ Transmissão encerrada.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      
      <canvas ref={previewCanvasRef} className="w-full max-w-3xl rounded-lg border border-[#ddc897]"></canvas>
      <div className="flex gap-4 mt-4">
        <button
          className="px-2 py-2 bg-green-400 text-white rounded-lg text-sm font-semibold"
          onClick={startLiveStream}
        >
          🎥 Iniciar Transmissão
        </button>

        <button
          className="px-2 py-2 bg-red-400 text-white rounded-lg text-sm font-semibold"
          onClick={stopLiveStream}
        >
          ⏹️ Encerrar Transmissão
        </button>
      </div>
    </div>
  );
}
*/
